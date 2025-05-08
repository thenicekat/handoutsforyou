export const admins = [
    "f20210075@hyderabad.bits-pilani.ac.in",
    "f20211511@hyderabad.bits-pilani.ac.in"
]

export const PS1_RESPONSES = "ps1_responses"
export const PS1_REVIEWS = "ps1_reviews"
export const PS2_RESPONSES = "ps2_responses"
export const PS2_REVIEWS = "ps2_reviews"
export const COURSE_REVIEWS = "course_reviews"
export const COURSE_RESOURCES = "course_resources"
export const COURSE_GRADING = "course_grading"
export const SI_CHRONICLES = "si_chronicles"
export const SI_COMPANIES = "si_companies"
export const PLACEMENT_CTCS = "placement_ctcs"
export const HIGHER_STUDIES_RESOURCES = "higherstudies_resources"
export const DONATIONS = "donations"
export const RANT_POSTS = "rants_posts"
export const RANT_COMMENTS = "rants_comments"

export const capitalize = (s: string) => {
    if (typeof s !== 'string') return ''
    s = s.toLowerCase()
    return s.replace(/\b\w/g, (c) => c.toUpperCase());
}