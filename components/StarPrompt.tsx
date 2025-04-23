import React from 'react'
import Modal from './Modal';

type Props = {
    setStarCount: (count: number) => void;
}

export default function StarPrompt({
    setStarCount
}: Props) {
    const [starPromptOpen, setStarPromptOpen] = React.useState(false);
    const [internalStarCount, setInternalStarCount] = React.useState(0);

    const getStarCount = async () => {
        const response = await fetch("https://api.github.com/repos/thenicekat/handoutsforyou");
        const res = await response.json();
        setInternalStarCount(res.stargazers_count || 0);
        setStarCount(res.stargazers_count || 0);
    };

    React.useEffect(() => {
        getStarCount();
    }, []);


    React.useEffect(() => {
        let localStarPromptStore = localStorage.getItem("starPromptStore");
        if (!localStarPromptStore) {
            localStorage.setItem("starPromptStore", JSON.stringify({ lastPrompt: Date.now() }));
            setStarPromptOpen(true);
        } else {
            const { lastPrompt } = JSON.parse(localStarPromptStore);
            if (Date.now() - lastPrompt >= 24 * 60 * 60 * 1000) {
                localStorage.setItem("starPromptStore", JSON.stringify({ lastPrompt: Date.now() }));
                setStarPromptOpen(true);
            }
        }
    }, []);

    return (<Modal open={starPromptOpen} >
        <div className="backdrop-blur-lg p-6 rounded-xl shadow-lg">
            <h3 className="text-md font-semibold text-white">
                ✨ Love this project? We will try to keep this alive and free for as long as possible. Please consider giving it a ⭐ on GitHub! ✨
            </h3>
            <div className="mt-4 flex flex-col gap-4">

                <button className="bg-gradient-to-r from-teal-400 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:scale-105 transition-transform"
                    onClick={() => {
                        window.open("https://github.com/thenicekat/handoutsforyou", "_blank");
                    }}
                >
                    ⭐️ Star on GitHub ({internalStarCount})
                </button>

                <button
                    className="bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:scale-105 transition-transform"
                    onClick={() => setStarPromptOpen(false)}
                >
                    Close
                </button>
            </div>
        </div>
    </Modal >)
}