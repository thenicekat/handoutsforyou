import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import { getMetaConfig } from '@/config/meta'
import minorData from '@/config/minor_programs.json'
import prereqsData from '@/public/prereqs.json'
import dynamic from 'next/dynamic'
import type * as React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const MermaidDiagram = dynamic(() => import('@/components/MermaidDiagram'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-500 border-t-transparent" />
        </div>
    ),
})

// Build a global lookup: course code -> course title from official prereqs data
const courseTitleLookup = new Map<string, string>()
;(prereqsData as { name: string }[]).forEach(item => {
    const match = item.name.match(/^([A-Z/]+\s+[A-Z0-9]+)\s+(.*)$/)
    if (match) {
        courseTitleLookup.set(match[1], match[2])
    }
})

interface Course {
    code?: string
    title?: string
    L?: string
    P?: string
    U?: string
    courses?: Course[]
    prereqs?: string[]
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
    isHyderabadOffered?: boolean
    hyderabadExclusions?: string | null
    department?: string
}

function parseRequirements(text: string) {
    const coursesMatch = text.match(/(\d+)\s*(?:courses?)?\s*\(min\)/i)
    const unitsMatch = text.match(/(\d+)\s*(?:units?)?\s*\(min\)/i)
    return {
        courses: coursesMatch ? coursesMatch[1] : null,
        units: unitsMatch ? unitsMatch[1] : null,
    }
}

function sanitizeId(code: string): string {
    return code.replace(/[^a-zA-Z0-9]/g, '_')
}

function generateMermaidGraph(minor: Minor): string | null {
    // Collect all courses with their type
    const courseMap = new Map<
        string,
        { title: string; type: 'core' | 'elective' }
    >()
    const edges: { from: string; to: string }[] = []

    function collectCourses(courses: Course[], type: 'core' | 'elective') {
        for (const course of courses) {
            if (course.courses && Array.isArray(course.courses)) {
                collectCourses(course.courses, type)
            } else if (course.code) {
                courseMap.set(course.code, {
                    title: course.title || course.code,
                    type,
                })
                if (course.prereqs && course.prereqs.length > 0) {
                    for (const prereq of course.prereqs) {
                        edges.push({ from: prereq, to: course.code })
                    }
                }
            }
        }
    }

    collectCourses(minor.core_courses || [], 'core')
    for (const pool of minor.elective_pools || []) {
        collectCourses(pool.courses || [], 'elective')
    }

    if (edges.length === 0) return null

    // Build the set of codes involved in at least one edge
    const involvedCodes = new Set<string>()
    for (const edge of edges) {
        involvedCodes.add(edge.from)
        involvedCodes.add(edge.to)
    }

    let mermaid = 'graph TD\n'

    // Define nodes
    for (const code of Array.from(involvedCodes)) {
        const id = sanitizeId(code)
        const info = courseMap.get(code)
        let label: string
        if (info) {
            label = `${code}<br/>${info.title}`
        } else {
            // External prereq — look up title from the global prereqs database
            const externalTitle = courseTitleLookup.get(code)
            label = externalTitle ? `${code}<br/>${externalTitle}` : code
        }
        mermaid += `    ${id}["${label}"]\n`
    }

    mermaid += '\n'

    // Define edges
    for (const edge of edges) {
        mermaid += `    ${sanitizeId(edge.from)} --> ${sanitizeId(edge.to)}\n`
    }

    mermaid += '\n'

    // Style nodes: core = teal, elective = blue, external = gray
    for (const code of Array.from(involvedCodes)) {
        const id = sanitizeId(code)
        const info = courseMap.get(code)
        if (info?.type === 'core') {
            mermaid += `    style ${id} fill:#0d9488,stroke:#14b8a6,color:#fff\n`
        } else if (info?.type === 'elective') {
            mermaid += `    style ${id} fill:#2563eb,stroke:#3b82f6,color:#fff\n`
        } else {
            // External prerequisite (not part of this minor)
            mermaid += `    style ${id} fill:#6b7280,stroke:#9ca3af,color:#fff\n`
        }
    }

    return mermaid
}

function RoadmapLegend() {
    return (
        <div className="flex flex-wrap gap-x-4 gap-y-2">
            <div className="flex items-center gap-1.5 md:gap-2">
                <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm bg-teal-600" />
                <span className="text-[10px] md:text-xs text-gray-300">
                    Core
                </span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
                <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm bg-blue-600" />
                <span className="text-[10px] md:text-xs text-gray-300">
                    Elective
                </span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
                <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm bg-gray-500" />
                <span className="text-[10px] md:text-xs text-gray-300">
                    External
                </span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
                <svg
                    className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                </svg>
                <span className="text-[10px] md:text-xs text-gray-300">
                    Requires
                </span>
            </div>
        </div>
    )
}

function InteractiveRoadmapModal({
    content,
    minorName,
    onClose,
}: {
    content: string
    minorName: string
    onClose: () => void
}) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(() =>
        typeof window !== 'undefined' && window.innerWidth < 768 ? 1.5 : 4
    )
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const isDragging = useRef(false)
    const lastPos = useRef({ x: 0, y: 0 })

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault()
        setScale(prev => Math.min(10, Math.max(0.3, prev - e.deltaY * 0.001)))
    }, [])

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        isDragging.current = true
        lastPos.current = { x: e.clientX, y: e.clientY }
    }, [])

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging.current) return
        const dx = e.clientX - lastPos.current.x
        const dy = e.clientY - lastPos.current.y
        lastPos.current = { x: e.clientX, y: e.clientY }
        setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }))
    }, [])

    const handleMouseUp = useCallback(() => {
        isDragging.current = false
    }, [])

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (e.touches.length !== 1) return
        isDragging.current = true
        lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }, [])

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!isDragging.current || e.touches.length !== 1) return
        const dx = e.touches[0].clientX - lastPos.current.x
        const dy = e.touches[0].clientY - lastPos.current.y
        lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }))
    }, [])

    const handleTouchEnd = useCallback(() => {
        isDragging.current = false
    }, [])

    const resetView = useCallback(() => {
        setScale(
            typeof window !== 'undefined' && window.innerWidth < 768 ? 1.5 : 4
        )
        setPosition({ x: 0, y: 0 })
    }, [])

    // Close on Escape key and prevent background scroll
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', handleKeyDown)

        // Prevent background scrolling
        const originalStyle = window.getComputedStyle(document.body).overflow
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = originalStyle
        }
    }, [onClose])

    if (typeof window === 'undefined') return null

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-label={`Prerequisite Roadmap: ${minorName}`}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col"
            style={{ position: 'fixed' }}
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-white/10 bg-gray-900/90 gap-3 md:gap-4 relative">
                <div className="flex flex-wrap items-center gap-2 md:gap-4 pr-10 md:pr-0">
                    <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white text-xs md:text-sm font-semibold rounded-full shadow-lg">
                        Prerequisite Roadmap
                    </span>
                    <span className="text-gray-300 text-xs md:text-sm font-medium">
                        {minorName}
                    </span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <div className="hidden md:block">
                        <RoadmapLegend />
                    </div>
                    <div className="hidden md:block h-6 w-px bg-white/20 mx-2" />

                    <div className="flex items-center justify-between md:justify-start w-full md:w-auto">
                        <div className="md:hidden">
                            <RoadmapLegend />
                        </div>
                        {/* Zoom controls */}
                        <div className="flex items-center gap-1 bg-white/10 rounded-lg px-2 py-1 ml-auto md:ml-0 shrink-0">
                            <button
                                onClick={() =>
                                    setScale(s => Math.max(0.3, s - 0.2))
                                }
                                className="p-1 hover:bg-white/10 rounded transition-colors text-gray-300"
                                title="Zoom out"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 12H4"
                                    />
                                </svg>
                            </button>
                            <span className="text-xs text-gray-400 min-w-[2.5rem] text-center">
                                {Math.round(scale * 100)}%
                            </span>
                            <button
                                onClick={() =>
                                    setScale(s => Math.min(10, s + 0.2))
                                }
                                className="p-1 hover:bg-white/10 rounded transition-colors text-gray-300"
                                title="Zoom in"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={resetView}
                                className="p-1 hover:bg-white/10 rounded transition-colors text-gray-300 ml-1"
                                title="Reset view"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Close Button positioned absolutely on mobile, statically on desktop */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 md:static md:ml-3 p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                    title="Close (Esc)"
                >
                    <svg
                        className="w-5 h-5 md:w-6 md:h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            {/* Interactive canvas */}
            <div
                ref={containerRef}
                className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing touch-none"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
            >
                <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transformOrigin: 'center center',
                        transition: isDragging.current
                            ? 'none'
                            : 'transform 0.1s ease-out',
                    }}
                >
                    <MermaidDiagram content={content} />
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-white/10 bg-gray-900/90">
                <p className="text-xs text-gray-400 italic">
                    Scroll to zoom · Drag to pan · Press Esc to close. Note:
                    Multiple arrows pointing to a single course do not
                    necessarily mean all those courses must be completed; it may
                    be an &apos;OR&apos; condition. Always verify exact
                    requirements with the official prerequisites page or
                    Academic Bulletin.
                </p>
            </div>
        </div>,
        document.body
    )
}

function PrerequisiteRoadmap({ minor }: { minor: Minor }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const mermaidContent = useMemo(() => generateMermaidGraph(minor), [minor])

    if (!mermaidContent) return null

    return (
        <div className="p-6 hover:bg-white/5 transition-colors duration-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between group"
            >
                <div className="flex items-center gap-3">
                    <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white text-sm font-semibold rounded-full shadow-lg">
                        Prerequisite Roadmap
                    </span>
                    <span className="text-xs text-gray-400 italic">
                        {isOpen ? 'Click to collapse' : 'Click to expand'}
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
                <div className="mt-4 animate-fade-in">
                    <RoadmapLegend />

                    {/* Inline Preview */}
                    <div className="mt-4 overflow-x-auto rounded-lg border border-white/10 bg-black/30 p-4 relative group">
                        <MermaidDiagram content={mermaidContent} />
                        {/* Expand overlay button */}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="absolute top-3 right-3 p-2 bg-teal-600/90 hover:bg-teal-500 text-white rounded-lg shadow-lg transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                            title="Open interactive view"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        <p className="text-xs text-gray-300 italic max-w-3xl pr-4">
                            Note: Multiple arrows pointing to a single course do
                            not necessarily mean all those courses must be
                            completed; it may be an &apos;OR&apos; condition.
                            Always verify exact requirements with the official
                            prerequisites page or Academic Bulletin.
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 transition-colors shrink-0 ml-4"
                        >
                            <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                                />
                            </svg>
                            Open interactive view
                        </button>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <InteractiveRoadmapModal
                    content={mermaidContent}
                    minorName={minor.name}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    )
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
                                            <div className="flex items-center justify-between gap-2">
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
                                                {minor.isHyderabadOffered && (
                                                    <span
                                                        title="Offered at Hyderabad Campus"
                                                        className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30"
                                                    >
                                                        H
                                                    </span>
                                                )}
                                            </div>
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
                                        {selectedMinor.department && (
                                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm text-blue-100 font-medium shadow-sm">
                                                Department:{' '}
                                                <strong>
                                                    {selectedMinor.department}
                                                </strong>
                                            </span>
                                        )}
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
                                        {selectedMinor.isHyderabadOffered && (
                                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 border border-teal-500/30 rounded-lg text-sm text-teal-100 font-medium shadow-sm">
                                                Offered in AY 26-27 (Hyderabad
                                                Campus)
                                            </span>
                                        )}
                                    </div>

                                    {/* Branch Restrictions */}
                                    <div className="p-6 hover:bg-white/5 transition-colors duration-200">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-2">
                                            Branch Restrictions
                                        </h3>
                                        {selectedMinor.hyderabadExclusions ? (
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                Students of these programs
                                                cannot access the minor:{' '}
                                                <strong className="text-amber-400">
                                                    {
                                                        selectedMinor.hyderabadExclusions
                                                    }
                                                </strong>
                                            </p>
                                        ) : (
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                No specific branch restrictions
                                                are currently documented for
                                                this minor. Please consult your
                                                campus AUGSD for definitive
                                                eligibility criteria.
                                            </p>
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

                                    {/* Prerequisite Roadmap */}
                                    <PrerequisiteRoadmap
                                        minor={selectedMinor}
                                    />
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
