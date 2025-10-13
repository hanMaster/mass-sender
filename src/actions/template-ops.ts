'use server';

import {uploadFormSchema, uploadNotificationSchema} from '@/lib/schemas';
import {addTemplate} from "@/lib/data/templates";
import {NotificationApprovedPayload, TemplateForAdd} from "@/lib/data/definitions";
import {addApprovedFiles} from "@/lib/data/notifications";

export async function uploadDocument(formData: FormData) {
    // Преобразуем FormData в объект для валидации
    const file = formData.get('file') as File;
    const comment = formData.get('comment') as string;
    const rawData = {file, comment};

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

export async function uploadApprovedFile(formData: FormData) {

    // Преобразуем FormData в объект для валидации
    const id = formData.get('id') as string;
    const approvedFile = formData.get('approvedFile') as File;
    const sigFile = formData.get('sigFile') as File;
    const comment = formData.get('comment') as string;
    const rawData = {id, approvedFile, sigFile, comment};

    // Валидация данных
    const validatedData = uploadNotificationSchema.safeParse(rawData);

    if (!validatedData.success) {

        console.log('[validatedData]', validatedData.error)

        return {
            success: false,
            errors: validatedData.error.issues.map(m => m.message),
            message: 'Ошибка валидации данных'
        };
    }

    try {
        const {id, approvedFile, sigFile, comment: validatedComment} = validatedData.data;
        const rawBufferPdf = await approvedFile.arrayBuffer();
        const bufferPdf = new Uint8Array(rawBufferPdf);
        const rawBufferSig = await sigFile.arrayBuffer();
        const bufferSig = new Uint8Array(rawBufferSig);

        const payload: NotificationApprovedPayload = {
            id,
            approvedFile: bufferPdf,
            sigFile: bufferSig,
            comment: validatedComment,
        }
        await addApprovedFiles(payload);
        return {success: true};

    } catch (error) {
        console.error('Upload error:', error);
        return {
            success: false,
            message: 'Ошибка при загрузке файлов на сервер'
        };
    }
}