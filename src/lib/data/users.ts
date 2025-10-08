'use server'
import postgres from 'postgres';
import {Result, User, UserForAdd} from "@/lib/data/definitions";
import {revalidatePath} from "next/cache";

const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});

export async function fetchUsers(): Promise<User[] | undefined> {
    try {
        return await sql<User[]>`SELECT *
                                 FROM users;`;

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch users.');
    }
}

export async function fetchUser(email: string,): Promise<User | undefined> {
    try {
        const user = await sql<User[]>`
            SELECT *
            FROM users
            WHERE users.email = ${email.toLowerCase()};
        `;

        return user[0];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch user.');
    }
}

export async function insertUser(user: UserForAdd): Promise<Result> {
    try {
        await sql`
            INSERT INTO users (name, email, role, password)
            VALUES (${user.name}, ${user.email}, ${user.role}, ${user.password});
        `;
        return {success: true};

    } catch (error) {
        console.error('Database Error:', error);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return {success: false, error: error.message};
    }
}

export async function removeUser(id: string) {
    await sql`DELETE
              FROM users
              WHERE id = ${id}`;
    revalidatePath('/users');
}