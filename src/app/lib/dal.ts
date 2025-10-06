import 'server-only'

import {cookies} from 'next/headers'
import {decrypt, SessionPayload} from '@/app/lib/session'
import {cache} from "react";
import {redirect} from "next/navigation";
import {JWTPayload} from "jose";

export const getSession = cache(async () => {
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)

    if (!session?.userId) {
        redirect('/login')
    }

    return {isAuth: true, user: toSessionData(session)}
})

function toSessionData(data: JWTPayload | undefined): SessionPayload | undefined {
    if (!data) {
        return
    }
    return {
        userId: data.userId as string,
        name: data.name as string,
        email: data.email as string,
        role: data.role as string,
        expiresAt: data.expiresAt as Date,

    }
}