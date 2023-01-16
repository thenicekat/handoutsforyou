type Minor = {
    title: string,
    desc: string,
    coursesRegd: Number,
    unitsReqd: Number,
    coreCourses: string[],
    electives: string[],
}

type Props = {
    minor: Minor
}

export default function MinorComponent({ minor }: Props) {
  return (
    <div className="border rounded-2xl p-4">
        <h1 className="text-3xl py-2">{minor.title}</h1>
        <h2 className="text-xl py-3">{minor.desc}</h2>
        <h1 className="text-2xl py-3">1. Core Courses</h1>
        <ol>
        {
            minor.coreCourses.map(coreCourse => (
                <li className="px-3">{coreCourse}</li>
            ))
        }
        </ol>
        <h1 className="text-2xl py-3">2. Electives</h1>
        <ol>
        {
            minor.electives.map(elective => (
                <li className="px-3">{elective}</li>
            ))
        }
        </ol>
    </div>
  )
}