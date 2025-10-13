"use client";

import {toast} from "sonner";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {CloudUpload, Paperclip} from "lucide-react";
import {FileInput, FileUploader, FileUploaderContent, FileUploaderItem} from "@/components/ui/file-upload";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {uploadApprovedFile} from "@/actions/template-ops";

const formSchema = z.object({
    files: z.array(z.instanceof(File)).refine((files) => files.length == 2, {
        message: 'Должно быть загружено 2 файла, уведомление и sig-файл'
    }),
    comment: z.string().min(1, {error: 'Описание обязательно к заполнению'})
});

export default function EditNotificationForm({id, comment}: { id: string; comment: string }) {

    const dropZoneConfig = {
        maxFiles: 2,
        maxSize: 1024 * 1024 * 4,
        multiple: true,
        accept: {
            'application/pdf': ['.pdf'],
            'application/pgp-signature': ['.sig'],
        },
    };
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            comment
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const formData = new FormData();
            formData.append("id", id);
            if (values.files[0].name.toLowerCase().endsWith(".pdf")) {
                formData.append("approvedFile", values.files[0]);
                formData.append("sigFile", values.files[1]);
            } else {
                formData.append("sigFile", values.files[0]);
                formData.append("approvedFile", values.files[1]);
            }
            formData.append("comment", comment);
            const res = await uploadApprovedFile(formData);
            console.log(res)
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    function displayFiles() {
        const files = form.getValues('files');

        console.log(files);

        if (Array.isArray(files) && files.length > 0) {
            return files.map((file, i) => (
                <FileUploaderItem key={i} index={i}>
                    <Paperclip className="h-4 w-4 stroke-current"/>
                    <span>{file.name}</span>
                </FileUploaderItem>
            ))
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 min-w-xl max-w-3xl mx-auto py-10">
                <FormField
                    control={form.control}
                    name="files"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Выберите файл</FormLabel>
                            <FormControl>
                                <FileUploader
                                    onValueChange={(val) => {
                                        form.setValue('files', val as File[]);
                                    }}
                                    dropzoneOptions={dropZoneConfig}
                                    className="relative bg-background rounded-lg p-2"
                                    {...field}
                                >
                                    <FileInput
                                        id="fileInput"
                                        className="outline-dashed outline-1 outline-slate-500"
                                    >
                                        <div className="flex items-center justify-center flex-col p-8 w-full ">
                                            <CloudUpload className='text-gray-500 w-10 h-10'/>
                                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Нажмите для загрузки</span>
                                                &nbsp; или перетащите сюда файлы
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                PDF и SIG
                                            </p>
                                        </div>
                                    </FileInput>
                                    <FileUploaderContent>
                                        {displayFiles()}
                                    </FileUploaderContent>
                                </FileUploader>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="comment"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Описание уведомления</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Введите описание"
                                    type="text"
                                    {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <Button type="submit" className='cursor-pointer'>Сохранить</Button>
                    <Button variant='outline' type="button">
                        <Link href='/notifications' className='cursor-pointer'>Отмена</Link>
                    </Button>
                </div>
            </form>
        </Form>
    )
}