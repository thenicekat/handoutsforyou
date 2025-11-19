import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import ContributionForm from '@/components/ContributionForm'
import ContributionProgress from '@/components/ContributionProgress'
import CustomToastContainer from '@/components/ToastContainer'
import { RESOURCE_COUNTS } from '@/pages/index'
import { useEffect, useState } from 'react'
import CountUp from 'react-countup'

export default function MaintenancePage() {
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const handleContributionAdded = () => {
        setRefreshTrigger(prev => prev + 1)
    }

    return (
        <>
            <Meta />
            <Menu doNotShowMenu={true} />

            <div className="container mx-auto px-4 pt-10 pb-4 flex items-center">
                <div className="w-full max-w-6xl mx-auto mt-8 px-4">
                    <ContributionProgress refreshTrigger={refreshTrigger} />
                    <ContributionForm onContributionAdded={handleContributionAdded} />
                </div>
            </div>

            <CustomToastContainer containerId="maintenance" />
        </>
    )
}
