import {IconCloudDownload, IconEdit, IconPlus, IconTrash} from "@tabler/icons-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {fetchNotifications} from "@/lib/data/notifications";
import Link from "next/link";

export default async function NotificationsTable() {
    const data = await fetchNotifications();

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
                    {data?.map((item, index) =>

                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{item.comment}</TableCell>
                            <TableCell>
                                <Link href={`/notifications/${item.id}/start-file`}
                                      className='link-button w-[100px]'><IconCloudDownload/>Скачать</Link>
                            </TableCell>
                            <TableCell>
                                <Link href={`/notifications/${item.id}/approved-file`}
                                      className='link-button w-[100px]'><IconCloudDownload/>Скачать</Link>
                            </TableCell>
                            <TableCell>{`${item.created_at.toLocaleDateString()} ${item.created_at.toLocaleTimeString()}`}</TableCell>

                            <TableCell className="text-right cursor-pointer">
                                <IconEdit title="Изменить"/>
                            </TableCell>
                            <TableCell className="cursor-pointer ">
                                <IconTrash title="Удалить"/>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}

