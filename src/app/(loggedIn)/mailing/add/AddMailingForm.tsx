"use client"

import {toast} from "sonner"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Input} from "@/components/ui/input"
import Link from "next/link";
import {NotificationForSelect, Result} from "@/lib/data/definitions";
import {projects} from "@/lib/utils";
import {redirect} from "next/navigation";
import {addMailing} from "@/lib/data/mailings";

const formSchema = z.object({
    project: z.string({error: 'Выберите проект'}).min(1, {error: 'Выберите проект'}),
    houseNumber: z.string({error: 'Укажите номер дома'}).min(1, {error: 'Укажите номер дома'}),
    notificationId: z.string({error: 'Выберите уведомление'}).min(1, {error: 'Выберите уведомление'})
});

export default function AddMailingForm({notifications}: { notifications: Result<NotificationForSelect[]> }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    if (!notifications.success) {
        toast.error(notifications.error);
        redirect('/mailing');
    }
    const notificationsList = notifications.data!;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const result = await addMailing(values);
        if (!result.success && result.error) {
            return toast.error(result.error);
        }
        if (result.success) {
            form.reset();
            toast.success('Рассылка создана успешно!');
            redirect('/mailing');
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 min-w-xl max-w-3xl mx-auto py-10">

                <div className="grid grid-cols-12 gap-4">

                    <div className="col-span-6">

                        <FormField
                            control={form.control}
                            name="project"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Проект</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl className='w-full'>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Выберите проект"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="w-[var(--radix-select-trigger-width)]">
                                            {projects.map(p => (
                                                <SelectItem value={p} key={p}>{p}</SelectItem>
                                            ))}

                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="col-span-6">

                        <FormField
                            control={form.control}
                            name="houseNumber"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Номер дома</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Выберите номер дома"
                                            type="text"
                                            {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                </div>

                <FormField
                    control={form.control}
                    name="notificationId"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Уведомление</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl className='w-full'>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите уведомление"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="w-[var(--radix-select-trigger-width)]">
                                    {notificationsList.map(n => (
                                        <SelectItem value={n.id} key={n.id}>{n.comment}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className="flex gap-4">
                    <Button className='bg-primary hover:bg-primary/80 cursor-pointer' type="submit">Сохранить</Button>
                    <Button variant='outline' type="button">
                        <Link href='/mailing' className='cursor-pointer'>Отмена</Link>
                    </Button>
                </div>
            </form>
        </Form>
    )
}