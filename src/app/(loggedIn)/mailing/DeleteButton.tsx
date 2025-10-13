'use client'

import {Button} from "@/components/ui/button";
import {useActionState, useEffect} from "react";
import {Result} from "@/lib/data/definitions";
import {toast} from "sonner";
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
import {IconTrash} from "@tabler/icons-react";
import {removeMailing} from "@/lib/data/mailings";

export function DeleteButton({id, comment}: { id: string; comment: string }) {
    const removeWithId = removeMailing.bind(null, id);
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
                    <IconTrash/>
                    Удалить
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={formAction}>
                    <DialogHeader>
                        <DialogTitle>Удаление уведомления!</DialogTitle>
                        <DialogDescription className="mb-5">
                            <span className='block'>Подтвердите ваше намерение удалить</span>
                            <strong>
                                {`уведомление "${comment}"`}
                            </strong>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" className='cursor-pointer'>Отмена</Button>
                        </DialogClose>
                        <Button type="submit" className='cursor-pointer'><IconTrash/> Удалить</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}