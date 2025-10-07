"use server";

import {z} from "zod";
import {createSession, deleteSession} from "@/lib/session";
import {redirect} from "next/navigation";
import {fetchUser} from "@/lib/data/users";
import bcrypt from "bcrypt";

const loginSchema = z.object({
    email: z.email({message: "Invalid email address"}).trim(),
    password: z
        .string()
        .min(8, {message: "Password must be at least 8 characters"})
        .trim(),
});

export type State = {
    errors?: {
        email?: string[];
    };
} | undefined;

export async function login(prevState: State, formData: FormData) {
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
    const user = await fetchUser(email);
    if (!user) {
        return {
            errors: {
                email: ["Некорректный email или пароль"],
            },
        };
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
        return {
            errors: {
                email: ["Некорректный email или пароль"],
            },
        };
    }

    await createSession(user);
    redirect("/dashboard");
}

export async function logout() {
    await deleteSession();
    redirect("/login");
}