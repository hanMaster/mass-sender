import postgres from 'postgres';
import {User} from "@/lib/data/definitions";

const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});

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