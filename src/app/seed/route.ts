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
            file       BYTEA        NOT NULL,
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
            id            UUID                     DEFAULT uuid_generate_v4() PRIMARY KEY,
            start_file    BYTEA        NOT NULL,
            approved_file BYTEA                    DEFAULT NULL,
            sig_file      BYTEA                    DEFAULT NULL,
            comment       VARCHAR(100) NOT NULL,
            created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            deleted_at    TIMESTAMPTZ              DEFAULT NULL
        );
    `;
}

async function migrateMailings() {
    await sql`
        CREATE TABLE IF NOT EXISTS mailings
        (
            id              UUID                     DEFAULT uuid_generate_v4() PRIMARY KEY,
            project         VARCHAR(20) NOT NULL,
            house_number    VARCHAR(20) NOT NULL,
            notification_id UUID        NOT NULL,
            collect_status  VARCHAR                  DEFAULT 'in progress',
            is_mail_sent    BOOLEAN                  DEFAULT FALSE,
            created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            deleted_at      TIMESTAMPTZ              DEFAULT NULL
        );
    `;
}

async function migrateMailList() {
    await sql`
        CREATE TABLE IF NOT EXISTS mail_list
        (
            id              UUID                     DEFAULT uuid_generate_v4() PRIMARY KEY,
            mailing_id      UUID         NOT NULL,
            funnel          VARCHAR(40)  NOT NULL,
            deal_id         VARCHAR(10)  NOT NULL,
            object_type     VARCHAR(10)  NOT NULL,
            object_number   VARCHAR(10)  NOT NULL,
            is_main_contact BOOLEAN                  DEFAULT FALSE,
            full_name       VARCHAR(100) NOT NULL,
            phone           VARCHAR(20)  NOT NULL,
            email           VARCHAR(100)  NOT NULL,
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
            // migrateNotifications(),
            // migrateMailings(),
            // migrateMailList()
        ]);

        return Response.json({message: 'Database seeded successfully'});
    } catch (error) {
        return Response.json({error}, {status: 500});
    }
}