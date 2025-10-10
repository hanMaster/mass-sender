import Link from "next/link";
import {IconPlus} from "@tabler/icons-react";
import {fetchTemplates} from "@/lib/data/templates";
import {DeleteButton} from "@/app/(loggedIn)/templates/DeleteButton";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

export default async function TemplatesTable() {
    const data = await fetchTemplates();

    return (
        <>
            <Link href='/templates/add'
                  className='link-button'>
                <IconPlus/>Добавить шаблон
            </Link>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">№</TableHead>
                        <TableHead>Описание шаблона</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                        <TableHead className="w-[200px]">Дата загрузки</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((item, index) =>

                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{item.comment}</TableCell>
                            <TableCell>
                                <Link href={`/templates/${item.id}/get`} className='link-button'>Скачать</Link>
                            </TableCell>
                            <TableCell>{`${item.created_at.toLocaleDateString()} ${item.created_at.toLocaleTimeString()}`}</TableCell>
                            <TableCell className="text-right">
                                <DeleteButton id={item.id}/>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}

