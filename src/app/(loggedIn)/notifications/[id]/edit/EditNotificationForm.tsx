"use client";

import {useState} from "react";
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

const formSchema = z.object({
    filename: z.string(),
    comment: z.string({error: 'Описание обязательно к заполнению'}).min(1, {error: 'Заполнить'})
});

export default function EditNotificationForm({id, comment}: { id: string; comment: string }) {

    const [files, setFiles] = useState<File[] | null>(null);

    const dropZoneConfig = {
        maxFiles: 2,
        maxSize: 1024 * 1024 * 4,
        multiple: true,
    };
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            comment
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log('id', id, 'values', values);
            toast(
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
            );
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 min-w-xl max-w-3xl mx-auto py-10">

                <FormField
                    control={form.control}
                    name="filename"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Выберите файл</FormLabel>
                            <FormControl>
                                <FileUploader
                                    value={files}
                                    onValueChange={setFiles}
                                    dropzoneOptions={dropZoneConfig}
                                    className="relative bg-background rounded-lg p-2"
                                >
                                    <FileInput
                                        id="fileInput"
                                        className="outline-dashed outline-1 outline-slate-500"
                                    >
                                        <div className="flex items-center justify-center flex-col p-8 w-full ">
                                            <CloudUpload className='text-gray-500 w-10 h-10'/>
                                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Click to upload</span>
                                                &nbsp; or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                SVG, PNG, JPG or GIF
                                            </p>
                                        </div>
                                    </FileInput>
                                    <FileUploaderContent>
                                        {files &&
                                            files.length > 0 &&
                                            files.map((file, i) => (
                                                <FileUploaderItem key={i} index={i}>
                                                    <Paperclip className="h-4 w-4 stroke-current"/>
                                                    <span>{file.name}</span>
                                                </FileUploaderItem>
                                            ))}
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