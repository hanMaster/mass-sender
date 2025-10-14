export default function MailingForm({project, houseNumber, collectStatus}:
                                    { project: string; houseNumber: string; collectStatus: string }) {
    return (
        <div className="flex flex-col gap-2 p-4 md:gap-6 md:p-6">

            <h1>Mailing {project} {houseNumber}</h1>
            <p>{collectStatus}</p>
        </div>


    )
}