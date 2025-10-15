import {houseMapping, projects} from "@/lib/utils";
import {AmoLead} from "@/lib/api/amo-crm";
import {Result} from "@/lib/data/definitions";

const formatAccount = process.env.PROF_FORMAT_ACCOUNT as string;
const formatKey = process.env.PROF_FORMAT_API_KEY as string;
const formatUrl = `https://${formatAccount}.profitbase.ru/api/v4/json`;

const cityAccount = process.env.PROF_CITY_ACCOUNT as string;
const cityKey = process.env.PROF_CITY_API_KEY as string;
const cityUrl = `https://${cityAccount}.profitbase.ru/api/v4/json`;

export interface ProfitData extends AmoLead {
    houseNumber: string;
}

export async function addProfitData(project: string, leads: AmoLead[]): Promise<Result<ProfitData[]>> {
    const res: ProfitData[] = [];
    const tokenResult = await getToken(project);
    if (!tokenResult.success) {
        return {success: false, error: tokenResult.error};
    }
    const token = tokenResult.data as string;
    for (const l of leads) {
        const profitResult = await getProfitData(l.leadId, project, token);
        if (!profitResult.success) {
            console.log('Failed to add profit data for lead: ', l.leadId, ' on project: ', project);
            return {success: false, error: profitResult.error};
        }
        const houseNumber = profitResult.data as string;
        res.push({...l, houseNumber});
    }
    return {success: true, data: res};
}

async function getToken(project: string): Promise<Result<string>> {
    const {key, baseUrl} = project === projects[0] ? {key: formatKey, baseUrl: formatUrl} : {
        key: cityKey,
        baseUrl: cityUrl
    };
    const payload = {type: "api-app", credentials: {pb_api_key: key}};
    const url = `${baseUrl}/authentication`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload),
        });
        const json = await response.json();
        return {success: true, data: json.access_token as string};
    } catch (error: any) {
        console.error(error);
        return {success: false, data: error.message};
    }
}

async function getProfitData(leadId: string, project: string, token: string): Promise<Result<string>> {
    const baseUrl = project === projects[0] ? formatUrl : cityUrl;
    const url = `${baseUrl}/property/deal/${leadId}?access_token=${token}`;
    try {
        const response = await fetch(url, {
            headers: {'Content-Type': 'application/json'},
        });
        const r = await response.json();
        const houseNumber = houseMapping[r.data[0]?.houseName];
        return {success: true, data: houseNumber};
    } catch (error: any) {
        console.error('[getProfitData] leadId: ', leadId, error);
        return {success: false, error: error.message};
    }
}
