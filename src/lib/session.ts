import "server-only";

import {SignJWT, jwtVerify} from 'jose'
import {cookies} from "next/headers";
import {User} from "@/lib/data/definitions";

const secretKey = "7up4LKZHGXz90yhsGqflElOs+RmnG5Hbyz3zutxZOrM=";
const encodedKey = new TextEncoder().encode(secretKey);

export type SessionPayload = {
    userId: string;
    name: string;
    email: string;
    role: string;
    expiresAt: Date;
}

export async function createSession(user: User) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({userId: user.id, name: user.name, email: user.email, role: user.role, expiresAt});

    (await cookies()).set("session", session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
    });
}

export async function deleteSession() {
    (await cookies()).delete("session");
}

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({alg: "HS256"})
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
    if (!session) {
        return;
    }
    try {
        const {payload} = await jwtVerify(session, encodedKey, {algorithms: ["HS256"]});
        return payload;
    } catch {
        await deleteSession();
    }

}