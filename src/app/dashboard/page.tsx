import {redirect} from "next/navigation";
import {getSession} from "@/app/lib/dal";
import AdminDashboard from "@/app/dashboard/AdminDashboard";
import UserDashboard from "@/app/dashboard/UserDashboard";
import {SessionPayload} from "@/app/lib/session";
import "./theme.css"

export default async function DashboardPage() {
    const session = await getSession();
    const userRole = session.user?.role;

    if (userRole === 'admin') {
        return <AdminDashboard user={session.user as SessionPayload}/>
    } else if (userRole === 'user') {
        return <UserDashboard user={session.user as SessionPayload}/>
    } else {
        redirect('/login')
    }
}
