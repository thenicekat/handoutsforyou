import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Custom404() {
    const router = useRouter()

    useEffect(() => {
        router.push('/error?error=NotFound')
    }, [router])

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Redirecting...</p>
        </div>
    )
}
