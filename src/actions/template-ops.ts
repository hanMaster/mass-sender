'use server';

import {uploadFormSchema} from '@/lib/schemas';
import * as fs from "node:fs";
import {addTemplate, fetchTemplateById} from "@/lib/data/templates";
import {TemplateForAdd} from "@/lib/data/definitions";
import {v4 as uuidv4} from 'uuid';
import {decode} from "jose/base64url";

export async function uploadDocument(formData: FormData) {
    console.log('[uploadDocument] start')
    // Преобразуем FormData в объект для валидации
    const file = formData.get('file') as File;
    const comment = formData.get('comment') as string;

    const rawData = {
        file,
        comment
    };

    // Валидация данных
    const validatedData = uploadFormSchema.safeParse(rawData);

    if (!validatedData.success) {

        console.log('[validatedData]', validatedData.error)

        return {
            success: false,
            errors: validatedData.error.issues.map(m => m.message),
            message: 'Ошибка валидации данных'
        };
    }

    try {
        const {file: uploadedFile, comment: validatedComment} = validatedData.data;
        const rawBuffer = await uploadedFile.arrayBuffer();
        const buffer = new Uint8Array(rawBuffer);
        // const filename = `tpl_${uuidv4()}.docx`;
        // const filePath = `./templates/${filename}`;
        // fs.writeFile(filePath, buffer, (err) => {
        //     if (err) {
        //         console.error('Error writing binary file:', err);
        //         return;
        //     }
        //     console.log(`Binary file saved successfully to: ${filePath}`);
        // });

        const payload: TemplateForAdd = {
            file: buffer,
            comment: validatedComment,
        }
        await addTemplate(payload);

        return {
            success: true,
            message: `Файл "${uploadedFile.name}" успешно загружен!`
        };

    } catch (error) {
        console.error('Upload error:', error);
        return {
            success: false,
            message: 'Ошибка при загрузке файла на сервер'
        };
    }
}

// export async function removeTemplateFile(filename: string) {
//     const filePath = `./templates/${filename}`;
//     fs.unlink (filePath, (err) => {
//         if (err) {
//             console.error('Error deleting file:', err);
//             return;
//         }
//         console.log(`${filePath} deleted successfully`);
//     });
// }

// export async function downloadTemplate(id: string) {
//     try {
//
//         const tpl = await fetchTemplateById(id);
//         if (!tpl) {
//             throw new Error('Template not found');
//         }
//         const buffer = decode(tpl.file);
//         const arrBuffer = buffer as unknown as ArrayBuffer;
//         console.log('[downloadTemplate]', arrBuffer);
//         const blob = new Blob([arrBuffer], { type: "application/octet-stream" });
//         console.log('[downloadTemplate]', blob);
//         // const url = window.URL.createObjectURL(blob);
//         // const a = document.createElement('a');
//         // a.href = url;
//         // a.download = 'document.docx';
//         // document.body.appendChild(a);
//         // a.click();
//         // window.URL.revokeObjectURL(url);
//         // document.body.removeChild(a);
//     } catch (e) {
//         console.log(e)
//     }
//
// }