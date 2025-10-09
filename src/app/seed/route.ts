import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});

async function migrateUsers() {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await sql`
        CREATE TABLE IF NOT EXISTS users
        (
            id       UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            name     VARCHAR(255) NOT NULL,
            email    TEXT         NOT NULL UNIQUE,
            role     VARCHAR(10)  NOT NULL,
            password TEXT         NOT NULL
        );
    `;
}

async function migrateTemplates() {
    await sql`
        CREATE TABLE IF NOT EXISTS templates
        (
            id         UUID                     DEFAULT uuid_generate_v4() PRIMARY KEY,
            filename   VARCHAR(255) NOT NULL,
            comment    VARCHAR(100) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            deleted_at TIMESTAMPTZ              DEFAULT NULL
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

async function migrateNotifications() {
    await sql`
        CREATE TABLE IF NOT EXISTS notifications
        (
            id              UUID                     DEFAULT uuid_generate_v4() PRIMARY KEY,
            filename        VARCHAR(100) NOT NULL,
            filename_signed VARCHAR(100)             DEFAULT NULL,
            comment         VARCHAR(100) NOT NULL,
            created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            deleted_at      TIMESTAMPTZ              DEFAULT NULL
        );
    `;
}

export async function GET() {
    try {
        await sql.begin(() => [
            // migrateUsers(),
            // seedAdmin(),
            // migrateTemplates(),
            // migrateNotifications()
        ]);

        return Response.json({message: 'Database seeded successfully'});
    } catch (error) {
        return Response.json({error}, {status: 500});
    }
}