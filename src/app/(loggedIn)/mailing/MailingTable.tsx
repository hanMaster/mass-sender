import {IconEdit, IconPlus} from "@tabler/icons-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {fetchMailings} from "@/lib/data/mailings";
import {DeleteButton} from "@/app/(loggedIn)/mailing/DeleteButton";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";

export default async function MailingTable() {
    const res = await fetchMailings();
    if (!res.success) {
        return `Ошибка чтения данных: ${res.error}`;
    }
    return (
        <>
            <Link href='/mailing/add' className='link-button'>
                <IconPlus/>Создать
            </Link>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">№</TableHead>
                        <TableHead>Проект</TableHead>
                        <TableHead>Номер дома</TableHead>
                        <TableHead>Уведомление</TableHead>
                        <TableHead>Дата создания рассылки</TableHead>
                        <TableHead>Рассылка выполнена</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {res.data!.map((item, index) =>

                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{item.project}</TableCell>
                            <TableCell>{item.house_number}</TableCell>
                            <TableCell>Уведомление о сдаче дома 15</TableCell>
                            <TableCell>{`${item.created_at.toLocaleDateString()} ${item.created_at.toLocaleTimeString()}`}</TableCell>
                            <TableCell><Badge variant='destructive'>Нет</Badge></TableCell>

                            <TableCell className="text-right cursor-pointer">
                                <Button variant='outline' className='hover:bg-green-300'>
                                    <Link href={`/notifications/${item.id}/edit`} className='flex gap-1'>
                                        <IconEdit title="Изменить"/>
                                        Изменить
                                    </Link>
                                </Button>
                            </TableCell>
                            <TableCell>
                                <DeleteButton id={item.id} comment={`${item.project} ${item.house_number}`}/>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}

