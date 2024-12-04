import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import * as UpChunk from '@mux/upchunk';

export default function Dashboard() {
    const [progress, setProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState(null);
    const inputRef = useRef(null)
    const csrfToken = usePage().props.csrf_token

    const handleUpload = async () => {
        try {

            console.log("start uploading")

            const upload = UpChunk.createUpload({
                endpoint: route('upload'),
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                },
                file: inputRef.current.files[0],
                chunkSize: 10 * 1024,
            });

            console.log("uploading")

            // Subscribe to events
            upload.on('error', (error) => {
                setStatusMessage(error.detail);
            });

            upload.on('progress', (progress) => {
                setProgress(progress.detail);
            });

            upload.on('success', () => {
                setStatusMessage("Wrap it up, we're done here. 👋");
            });
        } catch (error) {
            alert(error)
            setStatusMessage(JSON.stringify(error));
        }
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <h1>File upload button</h1>
                        <label htmlFor="file-picker">Select a video file:</label>
                        <input
                            type="file"
                            ref={inputRef}
                            id="file-picker"
                            name="file-picker"
                        />

                        <button onClick={handleUpload}>Upload</button>

                        <label htmlFor="upload-progress">Downloading progress:</label>
                        <progress value={progress} max="100" />

                        <em>{statusMessage}</em>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
