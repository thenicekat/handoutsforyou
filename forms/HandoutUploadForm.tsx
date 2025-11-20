import { useState } from 'react'

interface HandoutUploadFormProps {
    onSubmit: (form: { yearFolder: string; file: File }) => void
    isLoading: boolean
}

export default function HandoutUploadForm({ onSubmit, isLoading }: HandoutUploadFormProps) {
    const [yearFolder, setYearFolder] = useState('')
    const [file, setFile] = useState<File | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!yearFolder || !file) return
        onSubmit({ yearFolder, file })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium mb-2 text-white">Year / Semester Folder Name *</label>
                <input
                    type="text"
                    value={yearFolder}
                    onChange={(e) => setYearFolder(e.target.value)}
                    placeholder="e.g. 2024-25 Sem 1"
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-2 text-white">File *</label>
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-400/20 file:text-amber-500 hover:file:bg-amber-400/30 text-white"
                    required
                />
            </div>
            <div className="flex justify-center">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary btn-lg min-w-48"
                >
                    {isLoading ? 'Uploading...' : 'Upload Handout'}
                </button>
            </div>
        </form>
    )
}
