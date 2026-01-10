import { CoursePreReqGroup } from './Courses'

export type PrereqItem = {
    prereq_name: string
    pre_cop: string
    condition?: string
}

export type NestedPrereqNode = {
    type: 'AND' | 'OR'
    items: (PrereqItem | NestedPrereqNode)[]
}

export type ExtendedCoursePreReqGroup = Omit<CoursePreReqGroup, 'prereqs'> & {
    prereqs: PrereqItem[]
    prereqs_nested?: NestedPrereqNode
    completionRequirement?: string
}
