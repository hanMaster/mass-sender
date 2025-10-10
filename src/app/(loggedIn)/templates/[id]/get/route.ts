import {fetchTemplateById} from "@/lib/data/templates";
import {decode} from "jose/base64url";
import {notFound} from "next/navigation";
import {isValidUUIDv4} from "@/lib/utils";

export async function GET(req: Request, {params}: { params: Promise<{ id: string }> }
) {
    const {id} = await params;

    if (!isValidUUIDv4(id)) {
        notFound();
    }

    try {
        const tpl = await fetchTemplateById(id);
        if (!tpl.success) {
            notFound();
        }
        const buffer = decode(tpl.data!.file);
        const arrBuffer = buffer as unknown as ArrayBuffer;
        const blob = new Blob([arrBuffer], {type: "application/octet-stream"});
        const fileName = tpl.data!.comment;
        const encodedFilename = encodeURIComponent(fileName);
        const contentDisposition = `attachment; filename="template.docx"; filename*=UTF-8''${encodedFilename}.docx`;
        return new Response(blob, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': contentDisposition
            },
        })
    } catch (e) {
        console.log(e)
    }
}