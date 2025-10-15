import {Result} from "@/lib/data/definitions";
import {getFunnelIdByProjectAndHouseNumber, projects} from "@/lib/utils";

export type AmoLeadWithContact = {
    leadId: string;
    project: string;
    funnel: string;
    house_number: string;
    is_main_contact: boolean;
}

const formatAccount = process.env.AMO_FORMAT_ACCOUNT as string;
const formatPipelineId = process.env.AMO_FORMAT_PIPELINE_ID as string;
const formatToken = process.env.AMO_FORMAT_TOKEN as string;
const formatUrl = `https://${formatAccount}.amocrm.ru/api/v4/`;

const cityAccount = process.env.AMO_CITY_ACCOUNT as string;
const cityPipelineId = process.env.AMO_CITY_PIPELINE_ID as string;
const cityToken = process.env.AMO_CITY_TOKEN as string;
const cityUrl = `https://${cityAccount}.amocrm.ru/api/v4/`;

export async function getAmoLeadsByProject(project: string, houseNumber: string): Promise<Result<FullContact[]>> {
    console.log('Start collect contacts');

    // const waitingFunnelId = getWaitingFunnelIdByProject(project);
    if (project === projects[0]) {
        console.log('Format start: ', new Date().toLocaleTimeString());
        // ЖК Формат
        const token = formatToken;
        const {funnelId, funnelName} = getFunnelIdByProjectAndHouseNumber(project, houseNumber);
        if (!funnelId || !funnelName) {
            return {success: false, error: `Funnel not found for project: ${project} (${houseNumber})`};
        }
        const url = `${formatUrl}leads?filter[statuses][0][pipeline_id]=${formatPipelineId}&filter[statuses][0][status_id]=${funnelId}&with=contacts`;
        const amoLeadsResult = await getAmoLeads(url, token);
        if (!amoLeadsResult.success) {
            return {success: false, error: amoLeadsResult.error};
        }

        const result: FullContact[] = [];
        for (const lead of amoLeadsResult.data!) {
            for (const c of lead.contacts) {
                const url = `${formatUrl}contacts/${c.contactId}`;
                const amoContact = await getContactById(url, token, funnelName, lead.leadId, c.isMain);
                if (amoContact) {
                    result.push(amoContact);
                }
            }
        }
        // Берем только собственников
        const filtered = result.filter((contact: FullContact) => contact.owner);
        console.log('Format finish: ', new Date().toLocaleTimeString());
        return {success: true, data: filtered};
    } else {
        console.log('City start: ', new Date().toLocaleTimeString());
        const token = cityToken;
        const {funnelId, funnelName} = getFunnelIdByProjectAndHouseNumber(project, houseNumber);
        if (!funnelId || !funnelName) {
            return {success: false, error: `Funnel not found for project: ${project} (${houseNumber})`};
        }
        const url = `${cityUrl}leads?filter[statuses][0][pipeline_id]=${cityPipelineId}&filter[statuses][0][status_id]=${funnelId}&with=contacts`;
        const amoLeadsResult = await getAmoLeads(url, token);
        if (!amoLeadsResult.success) {
            return {success: false, error: amoLeadsResult.error};
        }

        const result: FullContact[] = [];
        for (const lead of amoLeadsResult.data!) {
            for (const c of lead.contacts) {
                const url = `${cityUrl}contacts/${c.contactId}`;
                const amoContact = await getContactById(url, token, funnelName, lead.leadId, c.isMain);
                if (amoContact) {
                    result.push(amoContact);
                }
            }
        }
        // Берем только собственников
        const filtered = result.filter((contact: FullContact) => contact.owner);
        console.log('City finish: ', new Date().toLocaleTimeString());
        console.table(filtered);
        return {success: true, data: filtered};
    }
}

type AmoLead = {
    leadId: string;
    contacts: {
        contactId: string;
        isMain: boolean;
    }[];
}

async function getAmoLeads(url: string, token: string): Promise<Result<AmoLead[]>> {
    try {
        const amoLeads: AmoLead[] = [];
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();
        const next = data._links.next;
        const mapped: AmoLead[] = data._embedded.leads.map((s: any) => ({
            leadId: s.id,
            contacts: s._embedded.contacts.map((c: any) => ({contactId: c.id, isMain: c.is_main}))
        }));
        amoLeads.push(...mapped);

        // Если результат более 250 строк, появится пагинация
        while (next) {
            const res = await fetch(next.href, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            const mapped: AmoLead[] = data._embedded.leads.map((s: any) => ({
                leadId: s.id,
                contacts: s._embedded.contacts.map((c: any) => ({contactId: c.id, isMain: c.is_main}))
            }));
            amoLeads.push(...mapped);
        }

        return {success: true, data: amoLeads};
    } catch (error: any) {
        console.error(error);
        return {success: false, error: error.message};
    }
}

export type FullContact = {
    funnel: string;
    leadId: string;
    id: string;
    owner: boolean;
    isMain: boolean;
    first_name: string;
    middle_name: string;
    last_name: string;
    phone: string;
    email: string;
}

async function getContactById(url: string, token: string, funnel: string, leadId: string, isMain: boolean): Promise<FullContact | undefined> {
    try {
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();
        return intoContact(data, leadId, isMain, funnel);
    } catch (error: any) {
        console.error(error);
    }
}

type CustomFieldsValues = {
    field_name: string;
    values: {
        value: string | number | boolean;
    }[]
}

function intoContact(raw: any, leadId: string, isMain: boolean, funnel: string): FullContact {
    const id = raw.id;
    const owner = (raw.custom_fields_values as CustomFieldsValues[])
        .find(cfv => cfv.field_name === 'Собственник')?.values[0].value as boolean;
    const first_name = (raw.custom_fields_values as CustomFieldsValues[])
        .find(cfv => cfv.field_name === 'Имя')?.values[0].value as string;
    const middle_name = (raw.custom_fields_values as CustomFieldsValues[])
        .find(cfv => cfv.field_name === 'Отчество')?.values[0].value as string;
    const last_name = (raw.custom_fields_values as CustomFieldsValues[])
        .find(cfv => cfv.field_name === 'Фамилия')?.values[0].value as string;
    const phone = (raw.custom_fields_values as CustomFieldsValues[])
        .find(cfv => cfv.field_name === 'Телефон')?.values[0].value as string;
    const email = (raw.custom_fields_values as CustomFieldsValues[])
        .find(cfv => cfv.field_name === 'Email')?.values[0].value as string;
    return {funnel, leadId, id, owner, isMain, first_name, middle_name, last_name, phone, email}
}