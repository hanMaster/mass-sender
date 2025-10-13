import {IconCloudDownload, IconEdit, IconPlus} from "@tabler/icons-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {fetchNotifications} from "@/lib/data/notifications";
import Link from "next/link";
import {DeleteButton} from "@/app/(loggedIn)/notifications/DeleteButton";
import {Button} from "@/components/ui/button";

export default async function NotificationsTable() {
    const res = await fetchNotifications();
    if (!res.success) {
        return `Ошибка чтения данных: ${res.error}`;
    }
    return (
        <>
            <Link href='/notifications/add' className='link-button'>
                <IconPlus/>Создать
            </Link>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">№</TableHead>
                        <TableHead>Описание уведомления</TableHead>
                        <TableHead>Исходный файл</TableHead>
                        <TableHead>Согласованный файл</TableHead>
                        <TableHead>Дата создания</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {res.data!.map((item, index) =>

                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{item.comment}</TableCell>
                            <TableCell>
                                <Link href={`/notifications/${item.id}/start-file`}
                                      className='link-button w-[120px]'><IconCloudDownload/>Скачать</Link>
                            </TableCell>
                            <TableCell>
                                {item.approved_file && (
                                    <Link href={`/notifications/${item.id}/approved-file`}
                                          className='link-button w-[120px]'><IconCloudDownload/>Скачать</Link>
                                )}
                            </TableCell>
                            <TableCell>{`${item.created_at.toLocaleDateString()} ${item.created_at.toLocaleTimeString()}`}</TableCell>

                            <TableCell className="text-right cursor-pointer">
                                <Button variant='outline' className='hover:bg-green-300'>
                                    <Link href={`/notifications/${item.id}/edit`} className='flex gap-1'>
                                        <IconEdit title="Изменить"/>
                                        Изменить
                                    </Link>
                                </Button>
                            </TableCell>
                            <TableCell>
                                <DeleteButton id={item.id} comment={item.comment}/>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}

