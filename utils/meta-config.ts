interface MetaConfig {
    title: string;
    description: string;
    keywords: string[];
    openGraph?: {
        title?: string;
        description?: string;
        image?: string;
        url?: string;
    };
}

export const defaultMetaConfig: MetaConfig = {
    title: "Handouts for You",
    description: "A website containing all BITS Pilani Hyderabad campus handouts, resources, and academic information",
    keywords: [
        "BITS Pilani",
        "Handouts",
        "BPHC",
        "Hyderabad Campus",
        "BITS Hyderabad",
        "BITS",
        "Pilani",
        "Handouts for you",
        "academics",
        "resources"
    ],
    openGraph: {
        title: "Handouts for You - BITS Pilani Hyderabad Campus",
        description: "One-stop destination for BITS Pilani Hyderabad Campus academic resources",
        image: "/icon-512.png",
    }
};

export type { MetaConfig };

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
        description: 'One stop place for your PS queries, handouts, and much more',
    }),
    rants: createMeta({
        title: 'Rants.',
        description: 'One stop place for your PS queries, handouts, and much more',
    }),
    si: createMeta({
        title: 'Summer Internships.',
        description: 'One stop place for your PS queries, handouts, and much more',
    }),
    'higherstudies': createMeta({
        title: 'Higher Studies Resources.',
        description: 'One stop place for your PS queries, handouts, and much more',
    }),
    'ps/chronicles': createMeta({
        title: 'PS Chronicles.',
        description: 'One stop place for your PS queries, handouts, and much more',
    }),
    'ps/cutoffs/ps1': createMeta({
        title: 'PS1 Cutoffs',
        description: 'One stop place for your PS queries, handouts, and much more',
    }),
    'ps/cutoffs/ps2': createMeta({
        title: 'PS2 Cutoffs',
        description: 'One stop place for your PS queries, handouts, and much more',
    }),
    'ps/reviews/ps1': createMeta({
        title: 'PS1 Reviews',
        description: 'One stop place for your PS queries, handouts, and much more',
    }),
    'ps/reviews/ps2': createMeta({
        title: 'PS2 Reviews',
        description: 'One stop place for your PS queries, handouts, and much more',
    }),
    'placements/ctcs': createMeta({
        title: 'Placement CTCs.',
        description: 'One stop place for your PS queries, handouts, and much more',
    }),
    'placements/resources': createMeta({
        title: 'Placement Resources.',
        description: 'One stop place for your PS queries, handouts, and much more',
    }),
    'courses/handouts': createMeta({
        title: 'Course Handouts.',
        description: 'A website containing all BITS Pilani Hyderabad campus handouts',
    }),
    'courses/resources': createMeta({
        title: 'Course Resources.',
        description: 'Handouts app for BITS Hyderabad',
    }),
    'courses/pyqs': createMeta({
        title: 'Course PYQs.',
        description: 'A website containing all BITS Pilani Hyderabad campus handouts',
    }),
    'courses/prereqs': createMeta({
        title: 'Course Prerequisites.',
        description: 'A website containing all BITS Pilani Hyderabad campus handouts',
    }),
    'courses/grading': createMeta({
        title: 'Course Grading.',
        description: 'A website containing all BITS Pilani Hyderabad campus handouts',
    }),
    'courses/reviews': createMeta({
        title: 'Course Reviews.',
        description: 'One stop place for your PS queries, handouts, and much more',
    }),
    chambers: createMeta({
        title: 'Professor Chambers.',
        description: 'Place for professor rants and reviews',
    }),
    faqs: createMeta({
        title: 'FAQs.',
        description: 'Frequently asked questions',
    }),
}

export const getMetaConfig = (key: string): MetaConfig => metaConfigs[key] ?? defaultMetaConfig; 