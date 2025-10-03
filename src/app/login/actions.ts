"use server";

import {z} from "zod";
import {createSession, deleteSession} from "@/app/lib/session";
import {redirect} from "next/navigation";

const testUser = {
    id: "1",
    email: "contact@cosdensolutions.io",
    password: "12345678",
};

const loginSchema = z.object({
    email: z.email({message: "Invalid email address"}).trim(),
    password: z
        .string()
        .min(8, {message: "Password must be at least 8 characters"})
        .trim(),
});

export async function login(prevState: any, formData: FormData) {
    const payload = {
        email: formData.get('email'),
        password: formData.get('password'),
    };
    const result = loginSchema.safeParse(payload);

    if (!result.success) {
        return {
            errors: {
                email: ["Некорректный email или пароль"],
            },
        };
    }

    const {email, password} = result.data;

    if (email !== testUser.email || password !== testUser.password) {
        console.log('email', email, 'password', password);
        return {
            errors: {
                email: ["Некорректный email или пароль"],
            },
        };
    }

    console.log("login before createSession", testUser.id);
    await createSession(testUser.id);
    console.log("login before redirect");
    redirect("/dashboard");
}

export async function logout() {
    await deleteSession();
    redirect("/login");
}