import Link from "next/link";
import {Button} from "@/components/ui/button";
import {IconPlus} from "@tabler/icons-react";
import {fetchTemplates} from "@/lib/data/templates";
import {DeleteButton} from "@/app/(loggedIn)/templates/DeleteButton";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";


export default async function TemplatesTable() {
    const data = await fetchTemplates();

    return (
        <>
            <Button className='bg-primary hover:bg-primary/90 max-w-50'>
                <Link href="/templates/add" className='flex items-center justify-center'>
                    <IconPlus/>
                    Добавить шаблон
                </Link>
            </Button>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">№</TableHead>
                        <TableHead>Описание шаблона</TableHead>
                        <TableHead className="w-[200px]">Дата загрузки</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((item, index) =>

                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{item.comment}</TableCell>
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

