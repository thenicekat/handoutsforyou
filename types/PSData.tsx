export type PS_Station = {
    station: string
    year: string
    allotment_round: string
    min: number
    max: number
}

export type PS_Review = {
    type: string,
    batch: string,
    station: string,
    review: string,
    created_at: string,
    created_by: string
}

export type PS1Item = {
    created_at: string;
    email: string;
    allotment_round: string;
    year_and_sem: string;
    station: string;
    cgpa: number;
    preference: number;
    id: number;
}

export type PS2Item = {
    id_number: string | undefined,
    year_and_sem: string,
    allotment_round: string,
    station: string,
    cgpa: number,
    preference: number,
    offshoot: number,
    offshoot_total: number,
    offshoot_type: string,
}