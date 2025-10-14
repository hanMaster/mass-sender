import {Result} from "@/lib/data/definitions";
import {projects} from "@/lib/utils";

export type Funnel = {
    id: string;
    name: string;
}

const formatAccount = process.env.AMO_FORMAT_ACCOUNT as string;
const formatPipelineId = process.env.AMO_FORMAT_PIPELINE_ID as string;
const formatToken = process.env.AMO_FORMAT_TOKEN as string;
const formatUrl = `https://${formatAccount}.amocrm.ru/api/v4/`;

const cityAccount = process.env.AMO_CITY_ACCOUNT as string;
const cityPipelineId = process.env.AMO_CITY_PIPELINE_ID as string;
const cityToken = process.env.AMO_CITY_TOKEN as string;
const cityUrl = `https://${cityAccount}.amocrm.ru/api/v4/`;

export async function getFunnelsByProject(project: string): Promise<Result<Funnel[]>> {
    if(project === projects[0]) {
        // ЖК Формат
        const token = formatToken;
        const url = `${formatUrl}leads/pipelines/${formatPipelineId}`;
        return getFunnels(url, token);
    } else {
        const token = cityToken;
        const url = `${cityUrl}leads/pipelines/${cityPipelineId}`;
        return getFunnels(url, token);
    }
}

async function getFunnels(url: string, token: string): Promise<Result<Funnel[]>> {
    try {
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();
        const funnels: Funnel[] = data._embedded.statuses.map((s: any) => ({
            id: s.id,
            name: s.name
        } as Funnel));
        const filtered = funnels.filter((f) => f.name.toLowerCase().includes('передача'))
        return {success: true, data: filtered};
    } catch (error: any) {
        console.error(error);
        return {success: false, error: error.message};
    }
}