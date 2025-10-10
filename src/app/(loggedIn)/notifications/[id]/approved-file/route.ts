import {decode} from "jose/base64url";
import {notFound} from "next/navigation";
import {isValidUUIDv4} from "@/lib/utils";
import {fetchNotificationById} from "@/lib/data/notifications";

export async function GET(req: Request, {params}: { params: Promise<{ id: string }> }
) {
    const {id} = await params;

    if (!isValidUUIDv4(id)) {
        notFound();
    }

    try {
        const notificationRecord = await fetchNotificationById(id);
        if (!notificationRecord.success) {
            notFound();
        }
        const buffer = decode(notificationRecord.data!.approved_file);
        const arrBuffer = buffer as unknown as ArrayBuffer;
        const blob = new Blob([arrBuffer], {type: "application/octet-stream"});
        const fileName = notificationRecord.data!.comment;
        const encodedFilename = encodeURIComponent(`${fileName} согласованный`);
        const contentDisposition = `attachment; filename="template.docx"; filename*=UTF-8''${encodedFilename}.docx`;
        return new Response(blob, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': contentDisposition
            },
        })
    } catch (e) {
        console.log(e);
        notFound();
    }
}