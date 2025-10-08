import {Button} from "@/components/ui/button";
import {removeTemplate} from "@/lib/data/templates";

export function DeleteButton({id}: { id: string }) {
    const removeWithId = removeTemplate.bind(null, id);
    return (
        <form action={removeWithId}>
            <Button className='bg-primary hover:bg-primary/80' type='submit'>Удалить</Button>
        </form>
    )
}