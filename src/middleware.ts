import {NextRequest, NextResponse} from "next/server";
import {decrypt} from "@/lib/session";

const protectedRoutes = ["/", "/dashboard"];
const adminRoutes = ["/settings"];
const publicRoutes = ["/login"];

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone()
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);
    const isAdminRoute = adminRoutes.includes(path);
    const cookie = req.cookies.get('session')?.value
    const session = await decrypt(cookie);

    if (isProtectedRoute && !session) {
        url.pathname = '/login'
        return NextResponse.redirect(url);
    }

    if (path === '/' && session) {
        url.pathname = '/dashboard'
        return NextResponse.redirect(url);
    }

    if (isAdminRoute && session?.role !== 'admin') {
        url.pathname = '/dashboard'
        return NextResponse.redirect(url);
    }

    if (isPublicRoute && session?.userId) {
        url.pathname = '/dashboard'
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}
