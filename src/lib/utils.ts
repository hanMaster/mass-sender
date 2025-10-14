import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function isValidUUIDv4(uuid: string) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
}

export const projects = ['ЖК Формат', 'DNS Сити'];

export const cityFunnelMapping = [
    {funnelId: '62508790', funnelName: 'Ожидание оплаты по договору', houseNumber: '0'},
    {funnelId: '65830426', funnelName: 'Передача ОКС 1.1', houseNumber: '1'},
    {funnelId: '69387438', funnelName: 'Передача окс 1.2', houseNumber: '2'},
    {funnelId: '80169978', funnelName: 'Передача окс 1.3', houseNumber: '3'},
    {funnelId: '71272314', funnelName: 'ПЕРЕДАЧА ОКС 12.1', houseNumber: '5'},
    {funnelId: '77654610', funnelName: 'передача окс 12.2', houseNumber: '6 строение 1'},
    {funnelId: '77654610', funnelName: 'передача окс 12.2', houseNumber: '6 строение 2'},
];

export const formatFunnelMapping = [
    {funnelId: '34779838', funnelName: 'Ожидание оплаты по договору', houseNumber: '0'},
    {funnelId: '42445378', funnelName: 'Передача ЖК1', houseNumber: '1'},
    {funnelId: '42445381', funnelName: 'Передача ЖК2', houseNumber: '2'},
    {funnelId: '42445384', funnelName: 'Передача ЖК3', houseNumber: '3'},
    {funnelId: '42445444', funnelName: 'Передача ЖК4', houseNumber: '4'},
    {funnelId: '47037019', funnelName: 'Передача ЖК5', houseNumber: '5'},
    {funnelId: '49969468', funnelName: 'Передача ЖК6', houseNumber: '6'},
    {funnelId: '51512659', funnelName: 'Передача ЖК7', houseNumber: '7'},
    {funnelId: '55209554', funnelName: 'Передача ЖК8', houseNumber: '8'},
    {funnelId: '42466366', funnelName: 'Передача ЖК9', houseNumber: '9'},
    {funnelId: '42466369', funnelName: 'Передача ЖК10', houseNumber: '10'},
    {funnelId: '57364514', funnelName: 'Передача ЖК11', houseNumber: '11'},
    {funnelId: '57364518', funnelName: 'Передача ЖК12', houseNumber: '12'},
    {funnelId: '71272306', funnelName: 'Передача ЖК13', houseNumber: '13'},
    {funnelId: '42397663', funnelName: 'Передача ЖК14', houseNumber: '14'},
    {funnelId: '67509302', funnelName: 'Передача ЖК15', houseNumber: '15'},
    {funnelId: '60359194', funnelName: 'Передача ЖК16', houseNumber: '16'},
];

export type HousesForSelect = {
    project: string;
    mapping: {
        funnelId: string;
        funnelName: string;
        houseNumber: string;
    }[];
}

export function getHouseNumbersForSelect() {
    return [
        {
            project: projects[0],
            mapping: formatFunnelMapping.slice(1),
        },
        {
            project: projects[1],
            mapping: cityFunnelMapping.slice(1),
        },
    ]
}