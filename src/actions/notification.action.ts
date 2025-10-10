'use server'
import {NotificationPayload, Result} from "@/lib/data/definitions";
import {fetchTemplateById} from "@/lib/data/templates";
import {prepareFile} from "@/lib/fillTemplate";
import {addNotification} from "@/lib/data/notifications";

export default async function handleSubmitNotification(p: NotificationPayload): Promise<Result<unknown>> {
    const tpl = await fetchTemplateById(p.templateId);
    if (!tpl.success) return tpl;
    const file = await prepareFile(tpl.data!, p);

    await addNotification({startFile: file, comment: p.comment});
    return {success: true}
}