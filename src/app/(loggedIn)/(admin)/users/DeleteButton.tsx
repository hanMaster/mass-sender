import {Button} from "@/components/ui/button";
import {removeUser} from "@/lib/data/users";

export function DeleteButton({id}: { id: string }) {
    const removeWithId = removeUser.bind(null, id);
    return (
        <form action={removeWithId}>
            <Button className='bg-primary hover:bg-primary/80' type='submit'>Удалить</Button>
        </form>
    )
}