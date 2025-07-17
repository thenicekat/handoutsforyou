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
    'placements/resources/add': createMeta({
        title: 'Placement Resources.',
        description: 'One stop place for your PS queries, handouts, and much more',
    }),
    'higherstudies': createMeta({
        title: 'Higher Studies Resources.',
        description: 'One stop place for your PS queries, handouts, and much more',
    }),
    'ps/reviews/ps1/add': createMeta({
        title: 'PS Reviews.',
        description: 'One stop place for your PS queries, handouts, and much more',
    }),
    'ps/reviews/ps1': createMeta({
        title: 'PS1 Reviews',
        description: 'One stop place for your PS queries, handouts, and much more',
    }),
    handouts: createMeta({
        title: 'Handouts.',
        description: 'A website containing all BITS Pilani Hyderabad campus handouts',
    }),
    'placements/ctcs/add': createMeta({
        title: 'Placement CTCs.',
        description: 'One stop place for your PS queries, handouts, and much more',
    }),
    'course/resources': createMeta({
        title: 'Course Resources.',
        description: 'Handouts app for BITS Hyderabad',
    }),
    'course/pyqs': createMeta({
        title: 'Course PYQs.',
        description: 'A website containing all BITS Pilani Hyderabad campus handouts',
    }),
    'course/reviews': createMeta({
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