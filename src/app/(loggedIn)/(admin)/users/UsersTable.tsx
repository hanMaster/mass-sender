import Link from "next/link";
import {IconPlus} from "@tabler/icons-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {fetchUsers} from "@/lib/data/users";
import {DeleteButton} from "@/app/(loggedIn)/(admin)/users/DeleteButton";

export default async function UsersTable() {
    const data = await fetchUsers();

    return (
        <>
            <Link href='/users/add'
                  className='bg-primary hover:bg-primary/90 max-w-72 flex justify-center p-1 rounded-md text-white dark:text-primary-foreground font-medium '>
                <IconPlus/>Добавить пользователя
            </Link>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">№</TableHead>
                        <TableHead>Имя и фамилия</TableHead>
                        <TableHead className="w-[400px]">Email</TableHead>
                        <TableHead className="w-[200px]">Роль</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((u, index) =>

                        <TableRow key={u.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{u.name}</TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>{u.role === 'user' ? 'Пользователь' : 'Администратор'}</TableCell>

                            <TableCell className="text-right">
                                <DeleteButton id={u.id}/>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}

