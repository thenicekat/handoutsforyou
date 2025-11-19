import AutoCompleter from '@/components/AutoCompleter'
import { FormField, SelectInput, TextArea } from '@/components/FormField'
import { courses } from '@/config/courses'
import { profs } from '@/config/profs'
import { gradedSemesters } from '@/config/years_sems'

interface CourseGradingFormProps {
    course: string
    setCourse: (value: string) => void
    dept: string
    setDept: (value: string) => void
    prof: string
    setProf: (value: string) => void
    semester: string
    setSemester: (value: string) => void
    gradingData: string
    setGradingData: (value: string) => void
    averageMark: string | null
    parsedData: string | null
    depts: string[]
    filterDepartmentCodes: (course: string) => string[]
}

export default function CourseGradingForm({
    course,
    setCourse,
    dept,
    setDept,
    prof,
    setProf,
    semester,
    setSemester,
    gradingData,
    setGradingData,
    averageMark,
    parsedData,
    depts,
    filterDepartmentCodes,
}: CourseGradingFormProps) {
    const semesterOptions = gradedSemesters.map((sem) => ({
        value: sem,
        label: sem,
    }))
    const deptOptions = filterDepartmentCodes(course).map((d) => ({
        value: d,
        label: d,
    }))

    return (
        <>
            <FormField label="Course" required>
                <AutoCompleter
                    items={courses}
                    value={course}
                    onChange={setCourse}
                    name="course"
                />
            </FormField>

            <FormField label="Department" required>
                <SelectInput
                    value={dept}
                    onChange={setDept}
                    options={deptOptions}
                    placeholder="Select department"
                />
            </FormField>

            <FormField label="Professor" required>
                <AutoCompleter
                    items={profs.map((p) => p.name)}
                    value={prof}
                    onChange={setProf}
                    name="professor"
                />
            </FormField>

            <FormField label="Semester" required>
                <SelectInput
                    value={semester}
                    onChange={setSemester}
                    options={semesterOptions}
                    placeholder="Select semester"
                />
            </FormField>

            <FormField label="Grading Data" required>
                <TextArea
                    value={gradingData}
                    onChange={setGradingData}
                    placeholder="Paste the grading data here..."
                    rows={10}
                />
                <div className="text-sm text-gray-400 mt-2">
                    Paste the raw grading data from the official source. The
                    system will automatically parse it.
                </div>
            </FormField>

            {averageMark && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-4">
                    <div className="text-green-400 font-semibold">
                        Average Mark: {averageMark}
                    </div>
                </div>
            )}

            {parsedData && (
                <FormField label="Parsed Data Preview">
                    <div className="bg-white/5 border border-white/20 rounded-lg p-4 max-h-60 overflow-y-auto">
                        <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                            {parsedData}
                        </pre>
                    </div>
                </FormField>
            )}
        </>
    )
}
