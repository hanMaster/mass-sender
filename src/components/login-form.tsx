'use client';

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {ComponentProps, useActionState, useEffect} from "react";
import {login} from "@/app/login/actions";
import {useFormStatus} from "react-dom";

export function LoginForm({
                              className,
                              ...props
                          }: ComponentProps<"div">) {
    const [state, loginAction] = useActionState(login, undefined)
    useEffect(() => {
        console.log("login state", state)
    }, [state]);
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Аутентификация</CardTitle>
                    <CardDescription>
                        Введите Ваш корпоративный email и пароль
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={loginAction}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="m@example.com"
                                    required
                                />

                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Пароль</Label>

                                </div>
                                <Input id="password" name="password" type="password" required/>
                            </div>
                            {state?.errors?.email && (
                                <p className="text-red-500">{state?.errors?.email[0]}</p>
                            )}
                            <SubmitButton/>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

function SubmitButton() {
    const {pending} = useFormStatus();

    return (
        <Button disabled={pending} type="submit" className="w-full">
            Вход
        </Button>
    );
}