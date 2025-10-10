'use server'
import {NotificationPayload, Result} from "@/lib/data/definitions";
import {fetchTemplateById} from "@/lib/data/templates";
import {prepareFile} from "@/lib/fillTemplate";
import {addNotification} from "@/lib/data/notifications";

export default async function handleSubmitNotification(p: NotificationPayload): Promise<Result> {
    const tpl = await fetchTemplateById(p.templateId);
    if (!tpl) return {success: false, error: "Template not found"}
    const file = await prepareFile(tpl, p);

    await addNotification({startFile: file, comment: p.comment});
    return {success: true}
}