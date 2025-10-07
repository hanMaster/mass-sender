'use client';

import {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {uploadFormSchema, UploadFormData} from '@/lib/schemas';
import {uploadDocument} from '@/actions/upload';

export default function DocumentUploadForm() {
    const [uploadResult, setUploadResult] = useState<{
        success: boolean;
        message: string;
        errors?: string[];
    } | undefined>(undefined);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {errors, isSubmitting},
        reset
    } = useForm<UploadFormData>({
        resolver: zodResolver(uploadFormSchema)
    });

    const file = watch('file');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setValue('file', acceptedFiles[0], {shouldValidate: true});
            setUploadResult(undefined);
        }
    }, [setValue]);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject
    } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/msword': ['.doc', '.docx']
        },
        maxFiles: 1,
        maxSize: 1024 * 1024 // 1MB
    });

    const onSubmit = async (data: UploadFormData) => {
        console.log('submit', data);
        const formData = new FormData();
        formData.append('file', data.file);
        formData.append('comment', data.comment);

        const result = await uploadDocument(formData);
        setUploadResult(result);

        if (result.success) {
            reset();
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Загрузка DOCX документа</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Dropzone для файла */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Документ *
                    </label>

                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                            isDragActive
                                ? 'border-blue-500 bg-blue-50'
                                : isDragReject
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                        }`}
                    >
                        <input {...getInputProps()} />

                        {file ? (
                            <div className="text-green-600">
                                <p className="font-medium">Выбран файл: {file.name}</p>
                                <p className="text-sm text-gray-500">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        ) : isDragActive ? (
                            <p className="text-blue-600">Отпустите файл здесь...</p>
                        ) : isDragReject ? (
                            <p className="text-red-600">Неподдерживаемый формат или размер файла</p>
                        ) : (
                            <div>
                                <p className="text-gray-600">
                                    Перетащите .docx файл сюда или кликните для выбора
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Поддерживаются только .docx файлы до 2MB
                                </p>
                            </div>
                        )}
                    </div>

                    {errors.file && (
                        <p className="text-red-600 text-sm mt-1">{errors.file.message}</p>
                    )}
                </div>

                {/* Описание */}
                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                        Описание *
                    </label>
                    <textarea
                        id="comment"
                        rows={4}
                        {...register('comment')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Добавьте комментарий к шаблону"
                    />
                    {errors.comment && (
                        <p className="text-red-600 text-sm mt-1">{errors.comment.message}</p>
                    )}
                </div>

                {/* Кнопка отправки */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? 'Загрузка...' : 'Загрузить документ'}
                </button>

                {/* Результат загрузки */}
                {uploadResult && (
                    <div
                        className={`p-4 rounded-md ${
                            uploadResult.success
                                ? 'bg-green-50 text-green-800 border border-green-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                    >
                        <p className="font-medium">{uploadResult.message}</p>

                        {uploadResult.errors && (
                            <ul className="mt-2 text-sm">
                                {uploadResult.errors.map((message) => (
                                    <li key={message}>
                                        <span>• {message}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
}