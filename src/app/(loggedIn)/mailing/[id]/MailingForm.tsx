import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {MailListRecord} from "@/lib/data/definitions";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {recollectContacts} from "@/actions/mailing.action";

export default function MailingForm({mailingId, collectStatus, contacts}: {
    mailingId: string;
    collectStatus: string;
    contacts: MailListRecord[]
}) {
    let status = 'В процессе';
    let color = 'text-gray-700';
    if (collectStatus === 'done') {
        status = 'Сбор завершен';
        color = 'text-green-600';
    } else if (collectStatus !== 'done' && collectStatus !== 'in progress') {
        status = `Ошибка сбора контактов: ${collectStatus}`;
        color = 'text-red-500';
    }

    return (
        <div className="flex flex-col gap-2 p-4 md:gap-6 md:p-6">
            <Label className='text-xl'>Статус сбора контактов: <span className={color}>{status}</span></Label>
            <div className="flex gap-4 w-3xl justify-between">
                <form action={recollectContacts}>
                    <input type="hidden" name="mailingId" value={mailingId}/>
                    <Button variant='default' type='submit'>Пересобрать</Button>
                </form>
            </div>
            {contacts.length > 0 && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>№</TableHead>
                            <TableHead>№ дома</TableHead>
                            <TableHead>Воронка</TableHead>
                            <TableHead className="w-[100px]">№ сделки</TableHead>
                            <TableHead>Тип объекта</TableHead>
                            <TableHead>№ объекта</TableHead>
                            <TableHead>ФИО</TableHead>
                            <TableHead>Основной</TableHead>
                            <TableHead>Телефон</TableHead>
                            <TableHead>Email</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contacts.map((item, index) =>
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>{item.house_number}</TableCell>
                                <TableCell>{item.funnel}</TableCell>
                                <TableCell>{item.deal_id}</TableCell>
                                <TableCell>{item.object_type}</TableCell>
                                <TableCell>{item.object_number}</TableCell>
                                <TableCell>{item.full_name}</TableCell>
                                <TableCell>{item.is_main_contact ? 'Да' : 'Нет'}</TableCell>
                                <TableCell>{item.phone}</TableCell>
                                <TableCell>{item.email}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}