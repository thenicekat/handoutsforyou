import React, { useState } from 'react'
import AutoCompleter from '@/components/AutoCompleter'
import { courses as courseNames } from '@/config/courses'
import { profs } from '@/config/profs'
import { pyqYears } from '@/config/years_sems'

interface PYQUploadFormProps {
    onSubmit: (form: { course: string; professor: string; year: string; file: File }) => void
    isLoading: boolean
}

export default function PYQUploadForm({ onSubmit, isLoading }: PYQUploadFormProps) {
    const [course, setCourse] = useState('')
    const [professor, setProfessor] = useState('')
    const [year, setYear] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState('')

    const allowedExtensions = ['pdf', 'doc', 'docx']
    const maxSizeBytes = 10 * 1024 * 1024 // 10MB

    const validateFile = (f: File): string | null => {
        const ext = f.name.split('.').pop()?.toLowerCase() || ''
        if (!allowedExtensions.includes(ext)) {
            return 'Invalid file type. Please upload a pdf/doc/docx.'
        }
        if (f.size > maxSizeBytes) {
            return 'File too large. Max size is 10MB.'
        }
        return null
    }

    const handleFileChange = (e: any) => {
        const f = e.target.files?.[0] || null
        setFile(f)
        if (f) {
            const validationError = validateFile(f)
            setError(validationError || '')
        } else {
            setError('')
        }
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        if (!course || !professor || !year || !file) {
            setError('Please fill all required fields.')
            return
        }
        const validationError = validateFile(file)
        if (validationError) {
            setError(validationError)
            return
        }
        setError('')
        onSubmit({ course, professor, year, file })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium mb-2 text-white">Course Name *</label>
                <AutoCompleter items={courseNames} value={course} onChange={setCourse} name="course" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-2 text-white">Professor *</label>
                <AutoCompleter items={profs.map((p) => p.name)} value={professor} onChange={setProfessor} name="professor" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-2 text-white">Year *</label>
                <AutoCompleter items={pyqYears} value={year} onChange={setYear} name="year" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-2 text-white">File (pdf/doc/docx) *</label>
                <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-400/20 file:text-amber-500 hover:file:bg-amber-400/30 text-white"
                />
            </div>
            {error && (
                <p className="text-red-400 text-sm" role="alert">
                    {error}
                </p>
            )}
            <div className="flex justify-center">
                <button type="submit" disabled={isLoading} className="btn btn-primary btn-lg min-w-48">
                    {isLoading ? 'Uploading...' : 'Upload PYQ'}
                </button>
            </div>
        </form>
    )
}
