export type CGPAGroup = {
    mincgpa: number
    maxcgpa: number
}

export type PS_Station = {
    [key: string]: CGPAGroup | string
}

// const sample: PS_Station[] = [
//     {
//         "name": "A.T. Kearney Consulting (India) Private Limited",
//         "23-24 2": {
//             "mincgpa": 8.2,
//             "maxcgpa": 8.907
//         }
//     }
// ]