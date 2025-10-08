import Link from "next/link";
import {Button} from "@/components/ui/button";
import {IconPlus} from "@tabler/icons-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {fetchUsers} from "@/lib/data/users";
import {DeleteButton} from "@/app/(loggedIn)/(admin)/users/DeleteButton";


export default async function UsersTable() {
    const data = await fetchUsers();

    return (
        <>
            <Button className='bg-primary hover:bg-primary/90 max-w-50'>
                <Link href="/users/add" className='flex items-center justify-center'>
                    <IconPlus/>
                    Добавить пользователя
                </Link>
            </Button>
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

