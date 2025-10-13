export default async function MailingPage(props: PageProps<'/mailing/[id]'>) {
    const {id} = await props.params
    return (
        <h1>mailing {id}</h1>
    )
}