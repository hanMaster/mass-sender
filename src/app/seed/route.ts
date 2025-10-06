import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});

async function migrateUsers() {
    await sql`CREATE
    EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await sql`
        CREATE TABLE IF NOT EXISTS users
        (
            id
            UUID
            DEFAULT
            uuid_generate_v4
        (
        ) PRIMARY KEY,
            name VARCHAR
        (
            255
        ) NOT NULL,
            email TEXT NOT NULL UNIQUE,
            role VARCHAR
        (
            10
        ) NOT NULL,
            password TEXT NOT NULL
            );
    `;
}

async function seedAdmin() {
    const hashedPassword = await bcrypt.hash('!Q@W#E$R%T6y', 10);
    return sql`
        INSERT INTO users (name, email, role, password)
        VALUES ('Andrey Khalepov', 'khalepov.an@dnsgroup.ru', 'admin', ${hashedPassword});
      `;
}

export async function GET() {
    try {
        await sql.begin(() => [
            // migrateUsers(),
            seedAdmin(),
        ]);

        return Response.json({message: 'Database seeded successfully'});
    } catch (error) {
        return Response.json({error}, {status: 500});
    }
}