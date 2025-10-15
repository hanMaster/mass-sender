import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Mailing, MailListRecord} from "@/lib/data/definitions";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {recollectContacts} from "@/actions/mailing.action";

export default function MailingForm({mailing, collectStatus, contacts}: {
    mailing: Mailing;
    collectStatus: string;
    contacts: MailListRecord[]
}) {
    let status = 'В процессе';
    let color = 'text-gray-700 dark:text-gray-400';
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
            <div className="flex gap-4 justify-between">
                <div className="flex flex-col gap-2">
                    <Label>Кол-во собранных сделок по воронкам:</Label>
                    <Label>{mailing.funnel_name} - {mailing.funnel_count} шт</Label>
                    <Label>Ожидание оплаты по договору - {mailing.wait_funnel_count} шт</Label>
                </div>
                <form action={recollectContacts}>
                    <input type="hidden" name="mailingId" value={mailing.id}/>
                    <Button variant='default' type='submit'>Пересобрать</Button>
                </form>
            </div>
            {contacts.length > 0 && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>№</TableHead>
                            <TableHead>ФИО</TableHead>
                            <TableHead>Email</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contacts.map((item, index) =>
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>{item.full_name}</TableCell>
                                <TableCell>{item.email}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}