interface MetaConfig {
    title: string
    description: string
    keywords: string[]
    openGraph?: {
        title?: string
        description?: string
        image?: string
        url?: string
    }
}

export const defaultMetaConfig: MetaConfig = {
    title: 'h4u. | handoutsforyou.',
    description:
        'One stop destination for all your queries regarding courses, professors, placements, resources, PS, SI and more, at BITS Pilani.',
    keywords: [
        'BITS Pilani',
        'Handouts',
        'BPHC',
        'h4u',
        'handoutsforyou',
        'handouts for you',
        'handouts for you BITS Pilani',
        'handouts for you BITS Hyderabad',
        'handouts for you BITS',
        'handouts for you BPHC',
        'h4u app',
        'h4u app BITS Pilani',
        'h4u app BITS Hyderabad',
        'h4u app BITS',
        'h4u app BPHC',
        'h4u app BITS Pilani Hyderabad',
        'h4u app BITS Pilani Hyderabad Campus',
        'h4u.app',
        'h4u.app BITS Pilani',
        'h4u.app BITS Hyderabad',
        'h4u.app BITS',
        'h4u.app BPHC',
        'h4u.app BITS Pilani Hyderabad',
        'h4u.app BITS Pilani Hyderabad Campus',
        'Hyderabad Campus',
        'BITS Hyderabad',
        'BITS',
        'Pilani',
        'Handouts for you',
        'academics',
        'resources',
        'BITS Pilani Hyderabad',
        'BITS Pilani handouts',
        'BPHC resources',
        'BITS Practice School cutoffs',
        'PS1 PS2 CGPA cutoffs',
        'Practice School reviews BITS',
        'Practice School Chronicles',
        'BITS SI cutoffs',
        'Summer Internship reviews BITS',
        'BITS SI Chronicles',
        'BITS higher studies guidance',
        'Study abroad BITS Pilani',
        'BITS placements CTC data',
        'BITS placement statistics',
        'BITS course handouts',
        'Course notes BITS Pilani',
        'Handwritten notes BITS',
        'BITS PYQs',
        'Previous year papers BITS',
        'BITS course prerequisites',
        'BITS course grading',
        'Grade vs marks BITS Pilani',
        'BITS course reviews',
        'Professor reviews BITS',
        'BITS Pilani prof chambers',
        'BITS professor office locations',
        'BITS FAQ',
        'FAQs BITS Hyderabad',
        'Student rants BITS Pilani',
        'BITS anonymous posts',
        'BITS Hyderabad academics',
        'h4u app BITS Pilani',
        'BITS Pilani student guide',
        'BITS course planning',
        'BITS academic roadmap',
        'BITS professor locator',
        'BITS course evaluation patterns',
        'BITS Pilani student tools',
        'BITS CTC search',
        'BITS course - wise statistics',
        'BITS internship reviews',
        'BITS Pilani mental health',
        'BITS placements dashboard',
        'BITS Pilani Hyderabad',
        'BITS course handouts',
        'Practice School BITS',
        'PS1 PS2 cutoffs',
        'BITS SI reviews',
        'higher studies BITS Pilani',
        'MS abroad BITS',
        'study abroad guide BITS',
        'BITS placements data',
        'CTC BITS Pilani',
        'professor reviews BITS',
        'handwritten notes BITS',
        'BITS question papers',
        'grading patterns BITS',
        'anonymous rants BITS',
        'student resources BITS Hyderabad',
        'course prerequisites BITS',
        'course reviews BITS Pilani',
        'BITS faculty locator',
        'campus life FAQs BITS',
        'BITS Pilani',
        'handouts',
        'resources',
        'h4u',
        'practice school',
        'ps',
        'practice',
        'school',
        'ps1',
        'ps2',
        'rants',
        'expression',
        'summer internship(s)',
        'SI',
        'summer',
        'internship',
        'higher education(any amount of letters used from these words)',
        'hd',
        'practice school',
        'ps',
        'chronicles',
        'ps1',
        'practice',
        'school',
        'practice school',
        'practice',
        'school',
        'ps',
        'ps1',
        'ps1 cutoff(s)',
        'cutoff(s)',
        'practice school',
        'practice',
        'school',
        'ps',
        'ps2',
        'ps2 cutoff(s)',
        'cutoff(s)',
        'practice school',
        'practice',
        'school',
        'ps',
        'ps1',
        'ps1 review(s)',
        'review(s)',
        'practice school',
        'practice',
        'school',
        'ps',
        'ps2',
        'ps2 review(s)',
        'review(s)',
        'placement(s)',
        'ctc(s)',
        'placement department',
        'course handout(s)',
        'course',
        'handout(s)',
        'course resources',
        'course',
        'reources',
        'material',
        'notes',
        'slides',
        'course pyq(s)',
        'course',
        'pyq(s)',
        'exam',
        'exam prep',
        'paper(s)',
        'ques paper(s)',
        'course prerequisite(s)',
        'course',
        'prerequisite(s)',
        'prereq(s)',
        'course prereq(s)',
        'course grading',
        'course',
        'grading',
        'grade(s)',
        'averages',
        'avs',
        'course review(s)',
        'course',
        'review(s)',
        'professor chamber(s)',
        'professor',
        'prof',
        'chamber',
        'chamber no.',
        'question(s)',
        'faq(s)',
    ],
    openGraph: {
        title: 'h4u. | handoutsforyou.',
        description:
            'One stop destination for all your queries regarding courses, professors, placements, resources, PS, SI and more, at BITS Pilani.',
        image: '/icon-512.png',
        url: 'https://h4u.app',
    },
}

export type { MetaConfig }

const createMeta = (partial: Partial<MetaConfig>): MetaConfig => ({
    ...defaultMetaConfig,
    ...partial,
    keywords: partial.keywords ?? defaultMetaConfig.keywords,
    openGraph: {
        ...defaultMetaConfig.openGraph,
        ...partial.openGraph,
    },
})

export const metaConfigs: Record<string, MetaConfig> = {
    index: defaultMetaConfig,
    ps: createMeta({
        title: 'Practice School.',
        description:
            'Find information on Practice School at BITS Pilani Hyderabad campus - cutoffs, chronicles, reviews and more.',
    }),
    rants: createMeta({
        title: 'Rants.',
        description:
            'Let all your feelings out - whether you’re lonely, happy, anxious, frustrated, or simply need to talk, just write it out here.',
    }),
    si: createMeta({
        title: 'Summer Internships.',
        description:
            'Find information on Summer Internships at BITS Pilani Hyderabad campus - cutoffs, chronicles, reviews and more.',
    }),
    higherstudies: createMeta({
        title: 'Higher Studies Resources.',
        description:
            'Guidance from seniors on how to apply abroad, to kickstart your journey in higher education.',
    }),
    'ps/chronicles': createMeta({
        title: 'PS Chronicles.',
        description:
            'Seniors’ experience at Practice school stations, compiled for your guidance.',
    }),
    'ps/cutoffs/ps1': createMeta({
        title: 'PS1 Cutoffs',
        description:
            'CGPA cutoffs for Practice School 1, with filters to make it easy to find what you want.',
    }),
    'ps/cutoffs/ps2': createMeta({
        title: 'PS2 Cutoffs',
        description:
            'CGPA cutoffs for Practice School 2, with filters to make it easy to find what you want.',
    }),
    'ps/reviews/ps1': createMeta({
        title: 'PS1 Reviews',
        description:
            'Crowdsourced reviews of seniors’ experience at Practice School 1 stations.',
    }),
    'ps/reviews/ps2': createMeta({
        title: 'PS2 Reviews',
        description:
            'Crowdsourced reviews of seniors’ experience at Practice School 2 stations.',
    }),
    'placements/ctcs': createMeta({
        title: 'Placement CTCs.',
        description:
            'Crowdsourced CTCs at placement, searchable by department, CGPA and company for ease of retrieval.',
    }),
    'placements/resources': createMeta({
        title: 'Placement Resources.',
        description:
            'One stop place for your PS queries, handouts, and much more',
    }),
    'courses/handouts': createMeta({
        title: 'Course Handouts.',
        description:
            'Handouts detailing course structure, evals, etc, searchable by course name, course code and year for ease of retrieval.',
    }),
    'courses/resources': createMeta({
        title: 'Course Resources.',
        description:
            'Handwritten notes, slides, handbooks, guides, crowdsourced and filtered by subject to guide your academics.',
    }),
    'courses/pyqs': createMeta({
        title: 'Course PYQs.',
        description:
            'Question papers from previous years, scraped from library website and crowdsourced, to help you with exam prep.',
    }),
    'courses/prereqs': createMeta({
        title: 'Course Prerequisites.',
        description:
            'Find out what you need to have studied formally beforehand to take any particular course.',
    }),
    'courses/grading': createMeta({
        title: 'Course Grading.',
        description:
            'Grade vs marks breakup with average, searchable by course name, prof name and semester for easy retrieval.',
    }),
    'courses/reviews': createMeta({
        title: 'Course Reviews.',
        description:
            'Crowdsourced reviews on particular courses, searchable by course name and prof name to help you make informed choices.',
    }),
    chambers: createMeta({
        title: 'Professor Chambers.',
        description:
            'Find out where to find any professor, any department. Searchable by prof name.',
    }),
    faqs: createMeta({
        title: 'FAQs.',
        description:
            'Frequently asked questions - about anything from academics to campus life to placements and beyond.',
    }),
}

export const getMetaConfig = (key: string): MetaConfig =>
    metaConfigs[key] ?? defaultMetaConfig
