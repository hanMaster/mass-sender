import {Result} from "@/lib/data/definitions";
import {getFunnelIdByProjectAndHouseNumber, getWaitingFunnelIdByProject, projects} from "@/lib/utils";
import {addProfitData} from "@/lib/api/profitbase";
import {saveFunnelLeadsCount, saveWaitingFunnelLeadsCount} from "@/lib/data/mailings";

const formatAccount = process.env.AMO_FORMAT_ACCOUNT as string;
const formatPipelineId = process.env.AMO_FORMAT_PIPELINE_ID as string;
const formatToken = process.env.AMO_FORMAT_TOKEN as string;
const formatUrl = `https://${formatAccount}.amocrm.ru/api/v4/`;

const cityAccount = process.env.AMO_CITY_ACCOUNT as string;
const cityPipelineId = process.env.AMO_CITY_PIPELINE_ID as string;
const cityToken = process.env.AMO_CITY_TOKEN as string;
const cityUrl = `https://${cityAccount}.amocrm.ru/api/v4/`;

export async function getAmoLeadsByProject(mailingId: string, project: string, houseNumber: string): Promise<Result<FullContact[]>> {
    console.log('Start collect contacts');
    const {token, baseUrl, pipeline} = project === projects[0] ? {
        token: formatToken,
        baseUrl: formatUrl,
        pipeline: formatPipelineId
    } : {
        token: cityToken,
        baseUrl: cityUrl,
        pipeline: cityPipelineId,
    };

    console.log('Collect contacts start: ', new Date().toLocaleTimeString());

    const {funnelId, funnelName} = getFunnelIdByProjectAndHouseNumber(project, houseNumber);
    if (!funnelId || !funnelName) {
        return {success: false, error: `Funnel not found for project: ${project} (${houseNumber})`};
    }
    const url = `${baseUrl}leads?filter[statuses][0][pipeline_id]=${pipeline}&filter[statuses][0][status_id]=${funnelId}&with=contacts`;
    const amoLeadsResult = await getAmoLeads(url, token);
    if (!amoLeadsResult.success) {
        return {success: false, error: amoLeadsResult.error};
    }

    let leadsByFunnel = amoLeadsResult.data!;
    if (houseNumber === '6 строение 1' || '6 строение 2') {
        const profitLeadsResult = await addProfitData(project, leadsByFunnel);
        if (!profitLeadsResult.success) {
            return {success: false, error: profitLeadsResult.error};
        }
        const profitLeads = profitLeadsResult.data!;
        leadsByFunnel = profitLeads.filter(i => i.houseNumber === houseNumber);
    }

    console.log(`В воронке ${funnelName} найдено лидов: ${leadsByFunnel.length}`);
    await saveFunnelLeadsCount(mailingId, funnelName, leadsByFunnel.length);

    const result: FullContact[] = [];
    for (const lead of leadsByFunnel) {
        for (const c of lead.contacts) {
            const url = `${baseUrl}contacts/${c.contactId}`;
            const res = await getContactById(url, token, funnelName, lead.leadId, c.isMain);
            if (res.success) {
                result.push(res.data!);
            } else {
                return {success: false, error: res.error};
            }
        }
    }

    // Берем только собственников
    const filtered = result.filter((contact: FullContact) => contact.owner);
    console.log('Collect contacts finish: ', new Date().toLocaleTimeString());
    return {success: true, data: filtered};
}

export type AmoLead = {
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

async function getContactById(url: string, token: string, funnel: string, leadId: string, isMain: boolean): Promise<Result<FullContact>> {
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
        return {success: false, error: error.message};
    }
}

type CustomFieldsValues = {
    field_name: string;
    values: {
        value: string | number | boolean;
    }[]
}

function intoContact(raw: any, leadId: string, isMain: boolean, funnel: string): Result<FullContact> {
    try {
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
        if (owner && !email) {
            return {success: false, error: `сделка: ${leadId}, контакт: ${id} email не найден`};
        }
        return {
            success: true,
            data: {funnel, leadId, id, owner, isMain, first_name, middle_name, last_name, phone, email}
        }
    } catch (error: any) {
        console.error(`[intoContact] leadId: ${leadId}, contactId: ${raw.id}`, error);
        return {success: false, error: error.message};
    }
}

export async function collectWaitingLeads(mailingId: string, project: string, houseNumber: string): Promise<Result<FullContact[]>> {
    const {funnelId, funnelName} = getWaitingFunnelIdByProject(project);
    const {baseUrl, pipeline, token} = project === projects[0] ? {
        baseUrl: formatUrl,
        pipeline: formatPipelineId,
        token: formatToken,
    } : {
        baseUrl: cityUrl,
        pipeline: cityPipelineId,
        token: cityToken,
    };

    const url = `${baseUrl}leads?filter[statuses][0][pipeline_id]=${pipeline}&filter[statuses][0][status_id]=${funnelId}&with=contacts`;
    const amoLeadsResult = await getAmoLeads(url, token);
    if (!amoLeadsResult.success) {
        return {success: false, error: amoLeadsResult.error};
    }
    const profitLeadsResult = await addProfitData(project, amoLeadsResult.data!);
    if (!profitLeadsResult.success) {
        return {success: false, error: profitLeadsResult.error};
    }
    const profitLeads = profitLeadsResult.data!;
    const filteredByHouse = profitLeads.filter(i => i.houseNumber === houseNumber);

    const result: FullContact[] = [];
    console.log('В воронке ожидания найдено лидов: ', filteredByHouse.length);
    await saveWaitingFunnelLeadsCount(mailingId, filteredByHouse.length);
    for (const lead of filteredByHouse) {
        for (const c of lead.contacts) {
            const url = `${cityUrl}contacts/${c.contactId}`;
            const res = await getContactById(url, token, funnelName, lead.leadId, c.isMain);
            if (res.success) {
                result.push(res.data!);
            } else {
                return {success: false, error: res.error};
            }
        }
    }

    // Берем только собственников
    const filtered = result.filter((contact: FullContact) => contact.owner);
    return {success: true, data: filtered};
}