'use client'
import {Button} from "@/components/ui/button";
import {removeTemplate} from "@/lib/data/templates";
import {useActionState, useEffect} from "react";
import {Result} from "@/lib/data/definitions";
import {toast} from "sonner";

export function DeleteButton({id}: { id: string }) {
    const removeWithId = removeTemplate.bind(null, id);
    const initialState: Result<unknown> = {
        success: false,
    }
    const [state, formAction] = useActionState(removeWithId, initialState);

    useEffect(() => {
        if (!state.success && state.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <form action={formAction}>
            <Button className='bg-primary hover:bg-primary/80 cursor-pointer' type='submit'>
                Удалить
            </Button>
        </form>
    )
}