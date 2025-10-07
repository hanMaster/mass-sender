import {z} from 'zod';

export const fileSchema = z.instanceof(File)
    .refine((file) => file.size > 0, {
        message: 'Файл не должен быть пустым'
    })
    .refine((file) => file.size <= 1024 * 1024, {
        message: 'Максимальный размер файла 1MB'
    })
    .refine((file) => {
        const allowedTypes = [
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'
        ];
        return allowedTypes.includes(file.type) || file.name.toLowerCase().endsWith('.docx');
    }, {
        message: 'Поддерживаются только .docx файлы'
    });

export const uploadFormSchema = z.object({
    file: fileSchema,
    comment: z.string()
        .min(1, 'Комментарий обязателен')
        .max(100, 'Слишком длинный комментарий'),
});

export type UploadFormData = z.infer<typeof uploadFormSchema>;