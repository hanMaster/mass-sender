'use client'
import {Button} from "@/components/ui/button";
import {removeTemplate} from "@/lib/data/templates";
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

export function DeleteButton({id}: { id: string }) {
    const removeWithId = removeTemplate.bind(null, id);
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
                        <DialogTitle>Удаление!</DialogTitle>
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