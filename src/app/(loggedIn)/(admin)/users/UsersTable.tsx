import Link from "next/link";
import {IconPlus} from "@tabler/icons-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {fetchUsers} from "@/lib/data/users";
import {DeleteButton} from "@/app/(loggedIn)/(admin)/users/DeleteButton";

export default async function UsersTable() {
    const res = await fetchUsers();
    if (!res.success) {
        return `Ошибка чтения данных: ${res.error}`;
    }

    return (
        <>
            <Link href='/users/add' className='link-button'>
                <IconPlus/>Создать
            </Link>
            <Table className='select-none'>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">№</TableHead>
                        <TableHead>Имя и фамилия</TableHead>
                        <TableHead className="w-[400px]">Email</TableHead>
                        <TableHead className="w-[200px]">Роль</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {res.data!.map((u, index) =>

                        <TableRow key={u.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{u.name}</TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>{u.role === 'user' ? 'Пользователь' : 'Администратор'}</TableCell>

                            <TableCell className="text-right">
                                <DeleteButton id={u.id} name={u.name}/>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}

