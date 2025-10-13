import EditNotificationForm from "@/app/(loggedIn)/notifications/[id]/edit/EditNotificationForm";
import {fetchNotificationById} from "@/lib/data/notifications";

export default async function EditNotificationPage(props: PageProps<'/notifications/[id]/edit'>) {
    const {id} = await props.params;
    const data = await fetchNotificationById(id);
    if (!data.success) {
        return data.error;
    }

    return <EditNotificationForm id={id} comment={data.data!.comment}/>;
}