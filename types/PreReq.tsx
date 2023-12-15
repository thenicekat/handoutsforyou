export type PreReq = {
    prereq_name: string,
    pre_cop: string
}

export type PreReqGroup = {
    name: string,
    all_one: string,
    prereqs: PreReq[]
};