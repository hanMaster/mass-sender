export default function DownloadLink({filename, downloadName}: { filename: string; downloadName: string }) {
    return (
        <a href={`/files/${filename}`} download={downloadName}>
            {downloadName}
        </a>
    )
}