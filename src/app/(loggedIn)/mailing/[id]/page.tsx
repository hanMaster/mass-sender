import {getFunnelsByProject} from "@/lib/api/amo-crm";
import {SiteHeader} from "@/components/site-header";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {fetchMailingById} from "@/lib/data/mailings";

export default async function MailingPage(props: PageProps<'/mailing/[id]'>) {
    const {id} = await props.params;
    const mailing = await fetchMailingById(id);
    if (!mailing.success) {
        return mailing.error;
    }
    const {project, house_number, created_at} = mailing.data!;
    const title = `Рассылка для ${project} Дом №${house_number} от ${created_at.toLocaleDateString()} ${created_at.toLocaleTimeString()}`;
    const res = await getFunnelsByProject(project);

    if (!res.success) {
        return res.error;
    }

    return (
        <>
            <SiteHeader title={title}/>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                        <p>Будет опрошена воронка &#34;ОЖИДАНИЕ ОПЛАТЫ ПО ДОГОВОРУ&#34;</p>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Воронка"/>
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    res.data!.map(item => (
                                        <SelectItem value={item.id} key={item.id}>{item.name}</SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>

                    </div>
                </div>
            </div>
        </>)
}