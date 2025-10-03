import {NextRequest, NextResponse} from "next/server";
import {decrypt} from "@/app/lib/session";

const protectedRoutes = ["/", "/dashboard"];
const publicRoutes = ["/login"];

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone()
    const path = req.nextUrl.pathname;
    console.log('[middleware]', path);
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    const cookie = req.cookies.get('session')?.value
    const session = await decrypt(cookie);
    console.log("[middleware] session", session);

    if (isProtectedRoute && !session?.userId) {
        url.pathname = '/login'
        return NextResponse.redirect(url);
    }

    if (isPublicRoute && session?.userId) {
        url.pathname = '/dashboard'
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// export const config = {
//     matcher: ['/login', '/dashboard'],
//     runtime: 'nodejs',
// }