import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import { getMetaConfig } from '@/config/meta'
import minorData from '@/config/minor_programs.json'
import { useMemo, useState } from 'react'

interface Course {
    code?: string
    title?: string
    L?: string
    P?: string
    U?: string
    courses?: Course[]
}

interface ElectivePool {
    pool_name: string
    pool_subtitle: string
    courses: Course[]
}

interface Minor {
    name: string
    description: string
    requirements_text: string
    core_courses: Course[]
    elective_pools: ElectivePool[]
}

function parseRequirements(text: string) {
    const coursesMatch = text.match(/(\d+)\s*(?:courses?)?\s*\(min\)/i)
    const unitsMatch = text.match(/(\d+)\s*(?:units?)?\s*\(min\)/i)
    return {
        courses: coursesMatch ? coursesMatch[1] : null,
        units: unitsMatch ? unitsMatch[1] : null,
    }
}

function CourseRow({ course, isOr }: { course: Course; isOr?: boolean }) {
    return (
        <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
            <td className="px-4 py-3 text-sm font-mono text-gray-300 whitespace-nowrap">
                {isOr && (
                    <span className="inline-block mr-2 px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 rounded">
                        OR
                    </span>
                )}
                {course.code || '—'}
            </td>
            <td className="px-4 py-3 text-sm text-gray-200">
                {course.title || '—'}
            </td>
            <td className="px-4 py-3 text-sm text-center text-gray-300">
                {course.L || '—'}
            </td>
            <td className="px-4 py-3 text-sm text-center text-gray-300">
                {course.P || '—'}
            </td>
            <td className="px-4 py-3 text-sm text-center text-gray-300">
                {course.U || '—'}
            </td>
        </tr>
    )
}

function CourseTable({
    label,
    subtitle,
    courses,
}: {
    label: string
    subtitle?: string
    courses: Course[]
}) {
    if (!courses || courses.length === 0) return null

    return (
        <div className="">
            <div className="flex items-center gap-3 mb-3">
                <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white text-sm font-semibold rounded-full shadow-lg">
                    {label}
                </span>
                {subtitle && (
                    <span className="text-xs text-gray-200 italic">
                        {subtitle}
                    </span>
                )}
            </div>
            <div className="overflow-x-auto rounded-lg border border-white/10">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gradient-to-r from-teal-700/60 to-teal-600/40">
                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-teal-200">
                                Course Number
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-teal-200">
                                Course Title
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-teal-200">
                                L
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-teal-200">
                                P
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-teal-200">
                                U
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-black/20">
                        {courses.map((course, idx) => {
                            // Handle "either/or" course groups
                            if (
                                course.courses &&
                                Array.isArray(course.courses)
                            ) {
                                return (
                                    <tr
                                        key={idx}
                                        className="border-b border-white/10 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-sm font-mono text-gray-300 whitespace-nowrap">
                                            {course.courses.map((c, i) => (
                                                <span key={i}>
                                                    {i > 0 && (
                                                        <span className="block my-1.5">
                                                            <span className="inline-block px-1.5 py-0.5 text-[12px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">
                                                                OR
                                                            </span>
                                                        </span>
                                                    )}
                                                    <span>{c.code}</span>
                                                </span>
                                            ))}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-200">
                                            {course.courses.map((c, i) => (
                                                <span key={i}>
                                                    {i > 0 && (
                                                        <span className="block my-1.5">
                                                            <span className="inline-block px-1.5 py-0.5 text-[12px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">
                                                                OR
                                                            </span>
                                                        </span>
                                                    )}
                                                    <span>{c.title}</span>
                                                </span>
                                            ))}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-center text-gray-300">
                                            {course.courses.map((c, i) => (
                                                <span key={i}>
                                                    {i > 0 && (
                                                        <span className="block my-1.5 invisible">
                                                            <span className="inline-block px-1.5 py-0.5 text-[12px] font-bold">
                                                                OR
                                                            </span>
                                                        </span>
                                                    )}
                                                    <span className="block">
                                                        {c.L || '—'}
                                                    </span>
                                                </span>
                                            ))}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-center text-gray-300">
                                            {course.courses.map((c, i) => (
                                                <span key={i}>
                                                    {i > 0 && (
                                                        <span className="block my-1.5 invisible">
                                                            <span className="inline-block px-1.5 py-0.5 text-[12px] font-bold">
                                                                OR
                                                            </span>
                                                        </span>
                                                    )}
                                                    <span className="block">
                                                        {c.P || '—'}
                                                    </span>
                                                </span>
                                            ))}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-center text-gray-300">
                                            {course.courses.map((c, i) => (
                                                <span key={i}>
                                                    {i > 0 && (
                                                        <span className="block my-1.5 invisible">
                                                            <span className="inline-block px-1.5 py-0.5 text-[12px] font-bold">
                                                                OR
                                                            </span>
                                                        </span>
                                                    )}
                                                    <span className="block">
                                                        {c.U || '—'}
                                                    </span>
                                                </span>
                                            ))}
                                        </td>
                                    </tr>
                                )
                            }
                            return <CourseRow key={idx} course={course} />
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function GeneralInfoSection() {
    const [isOpen, setIsOpen] = useState(false)
    const info = minorData.general_info

    return (
        <div className="mb-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-6 py-4 hover:bg-white/10 transition-all duration-300 group ${isOpen ? 'border-b border-white/10 bg-white/5' : ''}`}
            >
                <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-white">
                        General Information about Minors
                    </span>
                </div>
                <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="animate-fade-in bg-black/20 divide-y divide-white/10">
                    {/* Definition */}
                    <div className="p-6 hover:bg-white/5 transition-colors duration-200">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400 mb-2">
                            Definition
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {info.definition}
                        </p>
                    </div>

                    {/* General Guidelines */}
                    <div className="p-6 hover:bg-white/5 transition-colors duration-200">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400 mb-3">
                            General Guidelines
                        </h3>
                        <ul className="space-y-3">
                            {info.general_guidelines.map((g, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-3 text-gray-300 text-sm"
                                >
                                    <span className="text-teal-500 flex-shrink-0 text-lg leading-none mt-0.5">
                                        •
                                    </span>
                                    <span className="leading-relaxed">{g}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Requirements Table */}
                    <div className="p-6 hover:bg-white/5 transition-colors duration-200">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400 mb-3">
                            Requirements
                        </h3>
                        <p className="text-gray-400 text-xs mb-4">
                            {info.requirements.summary}
                        </p>
                        <div className="overflow-x-auto rounded-lg border border-white/10 shadow-sm">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-teal-700/40">
                                        <th className="px-4 py-3 text-left text-sm font-bold text-teal-200">
                                            Category
                                        </th>
                                        <th className="px-4 py-3 text-center text-sm font-bold text-teal-200">
                                            Courses
                                        </th>
                                        <th className="px-4 py-3 text-center text-sm font-bold text-teal-200">
                                            Units
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-black/40 divide-y divide-white/5">
                                    {info.requirements.table.map((row, i) => (
                                        <tr
                                            key={i}
                                            className="hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-4 py-3 text-sm text-gray-300">
                                                {row.category}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-center text-gray-300">
                                                {row.courses}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-center text-gray-300">
                                                {row.units}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Elective Pool Rules */}
                    <div className="p-6 hover:bg-white/5 transition-colors duration-200">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400 mb-3">
                            Elective Pool Rules
                        </h3>
                        <ul className="space-y-3">
                            {info.requirements.elective_pool.map((r, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-3 text-gray-300 text-sm"
                                >
                                    <span className="text-teal-500 flex-shrink-0 text-lg leading-none mt-0.5">
                                        •
                                    </span>
                                    <span className="leading-relaxed">{r}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Overlap Rules */}
                    <div className="p-6 hover:bg-white/5 transition-colors duration-200">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-3">
                            Overlap Rules
                        </h3>
                        <ul className="space-y-3">
                            {info.requirements.overlap_rules.map((r, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-3 text-gray-300 text-sm"
                                >
                                    <span className="text-amber-500 flex-shrink-0 text-lg leading-none mt-0.5">
                                        •
                                    </span>
                                    <span className="leading-relaxed">{r}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* GPA Requirement */}
                    <div className="p-6 hover:bg-white/5 transition-colors duration-200">
                        <div className="p-5 bg-gradient-to-r from-teal-500/10 to-teal-500/5 border border-teal-500/20 rounded-xl shadow-inner">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400 mb-2">
                                GPA Requirement
                            </h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {info.requirements.gpa_requirement}
                            </p>
                        </div>
                    </div>

                    {/* Process */}
                    <div className="p-6 hover:bg-white/5 transition-colors duration-200">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400 mb-4">
                            Process
                        </h3>
                        <ol className="space-y-4">
                            {info.process.map((step, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-4 text-gray-300 text-sm"
                                >
                                    <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-teal-600/20 border border-teal-500/30 text-teal-300 text-xs font-bold shadow-sm">
                                        {i + 1}
                                    </span>
                                    <span className="leading-relaxed mt-0.5">
                                        {step}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function Minors() {
    const minors: Minor[] = minorData.minors as Minor[]
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [searchQuery, setSearchQuery] = useState('')

    const filteredMinors = useMemo(() => {
        if (!searchQuery.trim()) return minors
        const q = searchQuery.toLowerCase()
        return minors.filter(m => m.name.toLowerCase().includes(q))
    }, [searchQuery, minors])

    const selectedMinor =
        filteredMinors.length > 0
            ? filteredMinors[selectedIndex] || filteredMinors[0]
            : null

    const reqs = selectedMinor
        ? parseRequirements(selectedMinor.requirements_text)
        : { courses: null, units: null }

    return (
        <>
            <Meta {...getMetaConfig('minors')} />
            <Menu />

            <div className="pb-12 px-4 md:px-8">
                {/* Page Title */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                        Minors.
                    </h1>
                    <p className="text-white text-sm">
                        Explore all minor programs offered at BITS Pilani
                    </p>
                </div>

                {/* General Info */}
                <div className="max-w-7xl mx-auto">
                    <GeneralInfoSection />
                </div>

                {/* Main Split Layout */}
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="w-full lg:w-[300px] flex-shrink-0">
                        <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                            {/* Search */}
                            <div className="p-3 border-b border-white/10 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Search for a Minor..."
                                    value={searchQuery}
                                    onChange={e => {
                                        setSearchQuery(e.target.value)
                                        setSelectedIndex(0)
                                    }}
                                    className="w-full px-4 py-2.5 bg-black/30 border border-white/15 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all"
                                />
                                <button
                                    onClick={() => {
                                        document
                                            .getElementById('minor-content')
                                            ?.scrollIntoView({
                                                behavior: 'smooth',
                                                block: 'start',
                                            })
                                    }}
                                    className="lg:hidden flex-shrink-0 px-3 py-2.5 bg-teal-600/20 border border-teal-500/30 rounded-lg text-teal-300 hover:bg-teal-600/30 transition-colors flex items-center justify-center"
                                    aria-label="Scroll to content"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Minor List */}
                            <div className="p-2 space-y-1">
                                {filteredMinors.length === 0 && (
                                    <p className="text-center text-gray-300 text-sm py-8">
                                        No minors found.
                                    </p>
                                )}
                                {filteredMinors.map((minor, idx) => {
                                    const isSelected =
                                        selectedMinor?.name === minor.name
                                    return (
                                        <button
                                            key={minor.name}
                                            onClick={() => {
                                                setSelectedIndex(idx)
                                                if (window.innerWidth < 1024) {
                                                    document
                                                        .getElementById(
                                                            'minor-content'
                                                        )
                                                        ?.scrollIntoView({
                                                            behavior: 'smooth',
                                                            block: 'start',
                                                        })
                                                }
                                            }}
                                            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 group ${
                                                isSelected
                                                    ? 'bg-gradient-to-r from-teal-600/30 to-teal-500/15 border border-teal-500/30 shadow-lg shadow-teal-500/5'
                                                    : 'hover:bg-white/5 border border-transparent'
                                            }`}
                                        >
                                            <span
                                                className={`text-sm font-medium block ${
                                                    isSelected
                                                        ? 'text-teal-300'
                                                        : 'text-gray-300 group-hover:text-white'
                                                }`}
                                            >
                                                {minor.name.replace(
                                                    'Minor in ',
                                                    ''
                                                )}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Content Panel */}
                    <div
                        id="minor-content"
                        className="flex-1 min-w-0 scroll-mt-24"
                    >
                        {selectedMinor ? (
                            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden flex flex-col transition-all duration-300">
                                {/* Minor Header */}
                                <div className="bg-gradient-to-r from-teal-700/60 to-teal-600/30 px-6 py-5 border-b border-white/10">
                                    <h2 className="text-2xl font-bold text-white">
                                        {selectedMinor.name}
                                    </h2>
                                </div>

                                <div className="bg-black/20 divide-y divide-white/10">
                                    {/* Description */}
                                    <div className="p-6 hover:bg-white/5 transition-colors duration-200">
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            {selectedMinor.description}
                                        </p>
                                    </div>

                                    {/* Requirements Badges */}
                                    <div className="p-6 hover:bg-white/5 transition-colors duration-200 flex flex-wrap gap-3">
                                        {reqs.courses && (
                                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/15 rounded-lg text-sm text-white font-medium shadow-sm">
                                                Courses:{' '}
                                                <strong>
                                                    {reqs.courses} (min)
                                                </strong>
                                            </span>
                                        )}
                                        {reqs.units && (
                                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/15 rounded-lg text-sm text-white font-medium shadow-sm">
                                                Units:{' '}
                                                <strong>
                                                    {reqs.units} (min)
                                                </strong>
                                            </span>
                                        )}
                                    </div>

                                    {/* Core Courses */}
                                    {selectedMinor.core_courses &&
                                        selectedMinor.core_courses.length >
                                            0 && (
                                            <div className="p-6 hover:bg-white/5 transition-colors duration-200">
                                                <CourseTable
                                                    label="Core Courses"
                                                    courses={
                                                        selectedMinor.core_courses
                                                    }
                                                />
                                            </div>
                                        )}

                                    {/* Elective Pools */}
                                    {selectedMinor.elective_pools
                                        .filter(
                                            pool =>
                                                pool.courses &&
                                                pool.courses.length > 0
                                        )
                                        .map((pool, idx) => (
                                            <div
                                                key={idx}
                                                className="p-6 hover:bg-white/5 transition-colors duration-200"
                                            >
                                                <CourseTable
                                                    label={pool.pool_name}
                                                    subtitle={
                                                        pool.pool_subtitle
                                                    }
                                                    courses={pool.courses}
                                                />
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
                                <p className="text-gray-300 text-lg">
                                    Select a minor from the sidebar to view
                                    details.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Note about Asterisk in Course Units */}
                <div className="max-w-7xl mx-auto mt-8">
                    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            <span className="text-teal-400 font-bold text-xl">
                                *
                            </span>{' '}
                            About Course Units with Asterisks
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                            In the BITS Pilani Academic Bulletin, an asterisk{' '}
                            <span className="text-teal-400 font-bold">*</span>{' '}
                            next to the units signifies that the course does not
                            have a fixed number of units or is graded
                            differently. Specifically:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-black/20 border border-white/5 rounded-lg overflow-hidden flex flex-col">
                                <div className="bg-gradient-to-r from-teal-700/60 to-teal-600/40 px-4 py-2.5 border-b border-white/10">
                                    <h4 className="text-sm font-semibold text-teal-100">
                                        Non-Letter Grading (GOOD/POOR)
                                    </h4>
                                </div>
                                <div className="p-4 flex-1">
                                    <p className="text-gray-300 text-xs leading-relaxed">
                                        Courses marked with an asterisk
                                        (especially audit-type courses or
                                        certain seminar/project courses) often
                                        award non-letter grades (like GOOD or
                                        POOR). These do not contribute to the
                                        CGPA calculation but are required for
                                        completing the degree/minor
                                        requirements.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-black/20 border border-white/5 rounded-lg overflow-hidden flex flex-col">
                                <div className="bg-gradient-to-r from-teal-700/60 to-teal-600/40 px-4 py-2.5 border-b border-white/10">
                                    <h4 className="text-sm font-semibold text-teal-100">
                                        Variable/Project Units
                                    </h4>
                                </div>
                                <div className="p-4 flex-1">
                                    <p className="text-gray-300 text-xs leading-relaxed">
                                        Certain project courses or elective
                                        offerings have units that depend on the
                                        specific project scope or are subject to
                                        department/instructor approval, or they
                                        denote that student work has practical
                                        components outside standard lectures.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
