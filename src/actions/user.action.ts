'use server'
import bcrypt from "bcrypt";
import {Result, UserForAdd} from "@/lib/data/definitions";
import {insertUser} from "@/lib/data/users";

export async function addUser(formData: FormData): Promise<Result<void>> {
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as string;
    const pwd = formData.get('password') as string;
    const password = await bcrypt.hash(pwd, 10);

    const payload: UserForAdd = {
        name: `${firstName} ${lastName}`,
        email: email.toLowerCase(),
        role,
        password
    }
    return insertUser(payload);
}