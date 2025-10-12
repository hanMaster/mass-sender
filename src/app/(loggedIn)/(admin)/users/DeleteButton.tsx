'use client';

import {Button} from "@/components/ui/button";
import {removeUser} from "@/lib/data/users";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Result} from "@/lib/data/definitions";
import {useActionState, useEffect} from "react";
import {toast} from "sonner";

export function DeleteButton({id}: { id: string }) {
    const removeWithId = removeUser.bind(null, id);
    const initialState: Result<void> = {
        success: false,
    }
    const [state, formAction] = useActionState(removeWithId, initialState);
    useEffect(() => {
        if (!state.success && state.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline"
                        className='hover:bg-red-600 hover:text-white dark:hover:bg-red-600 cursor-pointer'>
                    Удалить
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={formAction}>
                    <DialogHeader>
                        <DialogTitle>Удаление пользователя!</DialogTitle>
                        <DialogDescription>
                            Подтвердите ваше намерение
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" className='cursor-pointer'>Отмена</Button>
                        </DialogClose>
                        <Button type="submit" className='cursor-pointer'>Удалить</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}