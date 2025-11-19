import AutoCompleter from '@/components/AutoCompleter'
import { FormField, TextArea } from '@/components/FormField'
import { courses } from '@/config/courses'
import { profs } from '@/config/profs'

interface CourseReviewFormProps {
    course: string
    setCourse: (value: string) => void
    prof: string
    setProf: (value: string) => void
    review: string
    setReview: (value: string) => void
}

export default function CourseReviewForm({
    course,
    setCourse,
    prof,
    setProf,
    review,
    setReview,
}: CourseReviewFormProps) {
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

            <FormField label="Professor" required>
                <AutoCompleter
                    items={profs.map((p) => p.name)}
                    value={prof}
                    onChange={setProf}
                    name="professor"
                />
            </FormField>

            <FormField label="Review" required>
                <TextArea
                    value={review}
                    onChange={setReview}
                    placeholder="Write your review..."
                    rows={4}
                />
            </FormField>
        </>
    )
}
