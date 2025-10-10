"use client";

import {useForm} from "react-hook-form"
import Link from "next/link";
import {toast} from "sonner"
import {z} from "zod"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {zodResolver} from "@hookform/resolvers/zod"
import {addUser} from "@/actions/user.action";
import {redirect} from "next/navigation";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

const addUserSchema = z.object({
    firstName: z.string({error: 'Укажите имя'}),
    lastName: z.string({error: 'Укажите фамилию'}),
    email: z.email({error: 'Неверный формат email'}),
    role: z.enum(['user', 'admin'], {error: 'Выберите роль для пользователя'}),
    password: z.string().min(6, {error: 'Длина пароля не менее 6 символов'})
});

export default function AddUserForm() {

    const form = useForm<z.infer<typeof addUserSchema>>({
        resolver: zodResolver(addUserSchema),
    })

    async function onSubmit(values: z.infer<typeof addUserSchema>) {
        const formData = new FormData();
        formData.append('firstName', values.firstName);
        formData.append('lastName', values.lastName);
        formData.append('email', values.email);
        formData.append('role', values.role);
        formData.append('password', values.password);

        const result = await addUser(formData);
        if (result.error) {
            if (result.error.includes('users_email_key')) {
                toast.error('Такой email уже зарегистрирован!');
            } else {
                toast.error(result.error);
            }
            return;
        }
        toast.success('Пользователь добавлен успешно!');
        redirect('/users')

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
                    name="role"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Роль</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue='user'>
                                <FormControl className='w-full'>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Роль"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="w-[var(--radix-select-trigger-width)]">
                                    <SelectItem value="user">Пользователь</SelectItem>
                                    <SelectItem value="admin">Администратор</SelectItem>
                                </SelectContent>
                            </Select>
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