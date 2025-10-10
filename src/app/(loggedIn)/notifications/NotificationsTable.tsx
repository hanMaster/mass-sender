import {IconEdit, IconPlus} from "@tabler/icons-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {fetchNotifications} from "@/lib/data/notifications";
import DownloadLink from "@/app/(loggedIn)/notifications/DownloadLink";
import Link from "next/link";

export default async function NotificationsTable() {
    const data = await fetchNotifications();

    return (
        <>
            <Link href='/notifications/add'
                  className='link-button'>
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
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((item, index) =>

                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{item.comment}</TableCell>
                            <TableCell>
                                <DownloadLink filename={item.filename} downloadName={item.filename}/>
                            </TableCell>
                            <TableCell>
                                <DownloadLink filename={item.filename} downloadName={item.filename}/>
                            </TableCell>
                            <TableCell>{`${item.created_at.toLocaleDateString()} ${item.created_at.toLocaleTimeString()}`}</TableCell>

                            <TableCell className="text-right cursor-pointer">
                                <IconEdit/>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}

