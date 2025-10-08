"use client"
import {toast} from "sonner"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import Link from "next/link";

const formSchema = z.object({
    firstName: z.string().min(1, {error: 'Укажите имя'}),
    lastName: z.string().min(1, {error: 'Укажите фамилию'}),
    email: z.email({error: 'Неверный формат email'}),
    password: z.string().min(6, {error: 'Длина пароля не менее 6 символов'})
});

export default function AddUserForm() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values);
            toast(
                <pre className="mt-2 w-[320px] rounded-md bg-slate-950 p-4">
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-[500px] mx-auto py-10">
                <div className="grid grid-cols-12 gap-4">

                    <div className="col-span-6">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Имя</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Имя"
                                            type="text"
                                            autoComplete="off"
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
                            name="lastName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Фамилия</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Фамилия"
                                            type="text"
                                            autoComplete="off"
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
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Корпоративная почта</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="email"
                                    type="text"
                                    autoComplete="off"
                                    {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Пароль</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="пароль"
                                    type="password"
                                    autoComplete="new-password"
                                    {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className="flex gap-4">
                    <Button className='bg-primary hover:bg-primary/80 cursor-pointer' type="submit">Сохранить</Button>
                    <Button variant='secondary' className='cursor-pointer' type="button">
                        <Link href='/users'>Отмена</Link>
                    </Button>
                </div>
            </form>
        </Form>
    )
}