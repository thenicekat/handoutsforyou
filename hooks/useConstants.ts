import { axiosInstance } from '@/utils/axiosCache'
import { useEffect, useMemo, useState } from 'react'

export function useCourses() {
    const [courses, setCourses] = useState<string[]>([])

    useEffect(() => {
        axiosInstance
            .get('/api/constants/courses')
            .then(res => {
                if (!res.data.error) {
                    setCourses(res.data.data)
                }
            })
            .catch(() => {})
    }, [])

    return courses
}

export function useProfNames() {
    const [profNames, setProfNames] = useState<string[]>([])

    useEffect(() => {
        axiosInstance
            .get('/api/constants/profs')
            .then(res => {
                if (!res.data.error) {
                    setProfNames(res.data.data)
                }
            })
            .catch(() => {})
    }, [])

    return profNames
}

export function useProfNameSet() {
    const profNames = useProfNames()
    return useMemo(() => new Set(profNames), [profNames])
}
