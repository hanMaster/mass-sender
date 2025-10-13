'use server';

import postgres from 'postgres';
import {Result, User, UserForAdd} from "@/lib/data/definitions";
import {revalidatePath} from "next/cache";

const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});

export async function fetchUsers(): Promise<Result<User[]>> {
    try {
        const data = await sql<User[]>`SELECT *
                                       FROM users;`;
        return {success: true, data};

    } catch (error: any) {
        console.error('Database Error:', error);
        return {success: false, error: error.message};
    }
}

export async function fetchUser(email: string,): Promise<Result<User>> {
    try {
        const rows = await sql<User[]>`
            SELECT *
            FROM users
            WHERE users.email = ${email.toLowerCase()};
        `;
        if (!rows[0]) {
            return {success: false, error: `Пользователь с почтой ${email} не найден`};
        }
        return {success: true, data: rows[0]}
    } catch (error: any) {
        console.error('Database Error:', error);
        return {success: false, error: error.message};
    }
}

export async function insertUser(user: UserForAdd): Promise<Result<void>> {
    try {
        await sql`
            INSERT INTO users (name, email, role, password)
            VALUES (${user.name}, ${user.email}, ${user.role}, ${user.password});
        `;
        return {success: true};

    } catch (error: any) {
        console.error('Database Error:', error);
        return {success: false, error: error.message};
    }
}

export async function removeUser(id: string): Promise<Result<void>> {
    console.log('Remove user with [id]:', id);
    try {
        await sql`DELETE
                  FROM users
                  WHERE id = ${id}`;
        revalidatePath('/users');
        return {success: true};
    } catch (error: any) {
        console.error('Database Error:', error);
        return {success: false, error: error.message};
    }
}