'use server';

import {uploadFormSchema} from '@/lib/schemas';
import * as fs from "node:fs";
// import {revalidatePath} from 'next/cache';
// import {redirect} from 'next/navigation';

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
        const {file: uploadedFile} = validatedData.data;

        // Создаем FormData для загрузки файла
        const uploadFormData = new FormData();
        uploadFormData.append('document', uploadedFile);
        uploadFormData.append('comment', comment);

        console.log('[uploadedFile]', uploadedFile);

        const rawBuffer = await uploadedFile.arrayBuffer();

        const buffer = new Uint8Array(rawBuffer);

        const filePath = './upload/add.docx' ;
        fs.writeFile(filePath, buffer, (err) => {
            if (err) {
                console.error('Error writing binary file:', err);
                return;
            }
            console.log(`Binary file saved successfully to: ${filePath}`);
        });

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