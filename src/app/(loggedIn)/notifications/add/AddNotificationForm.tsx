"use client"

import {toast} from "sonner"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {format} from "date-fns"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Calendar} from "@/components/ui/calendar"
import {Calendar as CalendarIcon} from "lucide-react"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import Link from "next/link";
import {ru} from "date-fns/locale/ru";
import {TemplateForSelect} from "@/lib/data/definitions";
import handleSubmitNotification from "@/actions/notification.action";
import {redirect} from "next/navigation";

const addNotificationSchema = z.object({
    houseNumber: z.string({error: 'Укажите номер дома'}),
    date: z.date({error: 'Укажите дату ввода дома в эксплуатацию'}),
    templateId: z.string({error: 'Шаблон документа не выбран'}),
    comment: z.string({error: 'Добавьте описание уведомления'})
});

export default function AddNotificationForm({templates}: { templates: TemplateForSelect[] }) {

    const form = useForm<z.infer<typeof addNotificationSchema>>({
        resolver: zodResolver(addNotificationSchema),
        defaultValues: {
            houseNumber: '1',
            date: new Date(),
            comment: 'Сообщение о завершении строительства и передаче объекта'
        },
    })

    async function onSubmit(values: z.infer<typeof addNotificationSchema>) {
        try {
            const result = await handleSubmitNotification(values);
            if (result.success) {
                form.reset();
                toast.success('Уведомление создано успешно!');
                redirect('/notifications');
            }
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-[500px] mx-auto py-10">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="houseNumber"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Номер дома</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Номер дома"
                                            type="text"
                                            {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="date"
                            render={({field}) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Дата сдачи объекта</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl className='w-full'>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP", {locale: ru})
                                                    ) : (
                                                        <span>Выберите дату</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={new Date(field.value)}
                                                onSelect={field.onChange}
                                                autoFocus={true}
                                                locale={ru}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="templateId"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Шаблон</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl className='w-full'>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите шаблон"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="w-[var(--radix-select-trigger-width)]">
                                    {templates.map(t => (
                                        <SelectItem value={t.id} key={t.id}>{t.comment}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                                    placeholder="Описание уведомления"
                                    type="text"
                                    autoComplete='off'
                                    {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <Button className='bg-primary hover:bg-primary/80 cursor-pointer' type="submit">Сохранить</Button>
                    <Button variant='secondary' className='cursor-pointer' type="button">
                        <Link href='/notifications'>Отмена</Link>
                    </Button>
                </div>
            </form>
        </Form>
    )
}