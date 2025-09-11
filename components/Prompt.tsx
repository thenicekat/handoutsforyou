import React from 'react'
import Modal from './Modal'

type Props = {
    setStarCount: (count: number) => void
}

export default function StarPrompt({ setStarCount }: Props) {
    const [starPromptOpen, setStarPromptOpen] = React.useState(false)
    const [internalStarCount, setInternalStarCount] = React.useState(0)

    const getStarCount = async () => {
        try {
            const response = await fetch(
                'https://api.github.com/repos/thenicekat/handoutsforyou'
            )
            const data = await response.json()
            setInternalStarCount(data.stargazers_count || 0)
            setStarCount(data.stargazers_count || 0)
        } catch (error) {}
    }

    React.useEffect(() => {
        getStarCount()
    }, [])

    React.useEffect(() => {
        let localStarPromptStore = localStorage.getItem('starPromptStore')
        if (!localStarPromptStore) {
            localStorage.setItem(
                'starPromptStore',
                JSON.stringify({ lastPrompt: Date.now() })
            )
            setStarPromptOpen(true)
        } else {
            const { lastPrompt } = JSON.parse(localStarPromptStore)
            if (Date.now() - lastPrompt >= 24 * 60 * 60 * 1000) {
                localStorage.setItem(
                    'starPromptStore',
                    JSON.stringify({ lastPrompt: Date.now() })
                )
                setStarPromptOpen(true)
            }
        }
    }, [])

    return (
        <Modal open={starPromptOpen}>
            <div className="backdrop-blur-lg p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-white text-center">
                    h4u now has ads!
                </h3>
                <br />
                <p className="text-sm text-white text-center">
                    We know ads can be annoying—but they help us keep the site
                    running. Your support through viewing ads helps cover server
                    and domain costs. If you enjoy using this site, consider
                    keeping ads on. Every bit counts. Thank you
                </p>
                <div className="mt-4 flex flex-col gap-4">
                    <button
                        className="bg-gradient-to-r from-teal-400 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:scale-105 transition-transform"
                        onClick={() => {
                            window.open(
                                'https://github.com/thenicekat/handoutsforyou',
                                '_blank'
                            )
                        }}
                    >
                        ⭐️ Star on GitHub ({internalStarCount})
                    </button>

                    <button
                        className="bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:scale-105 transition-transform"
                        onClick={() => setStarPromptOpen(false)}
                    >
                        Ignore
                    </button>
                </div>
            </div>
        </Modal>
    )
}
