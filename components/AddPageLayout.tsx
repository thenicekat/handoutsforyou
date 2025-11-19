import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import CustomToastContainer from '@/components/ToastContainer'
import { ReactNode } from 'react'

interface AddPageLayoutProps {
    title: string
    metaConfig: any
    containerId: string
    children: ReactNode
}

export default function AddPageLayout({
    title,
    metaConfig,
    containerId,
    children,
}: AddPageLayoutProps) {
    return (
        <>
            <Meta {...metaConfig} />
            <Menu doNotShowMenu={true} />

            <div className="container mx-auto px-4 pt-10 pb-4 flex items-center">
                <div className="w-full max-w-4xl mx-auto mt-8 px-4">
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                        <h1 className="text-3xl font-bold text-white mb-8 text-center">
                            {title}
                        </h1>
                        {children}
                    </div>
                </div>
            </div>

            <CustomToastContainer containerId={containerId} />
        </>
    )
}
