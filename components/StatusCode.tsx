import React from 'react'
import Image from 'next/image'

type Props = {
    code: number
}

export default function StatusCode({ code }: Props) {
    const [starCount, setStarCount] = React.useState(0);

    const getStarCount = async () => {
        const response = await fetch("https://api.github.com/repos/thenicekat/handoutsforyou");
        const res = await response.json();
        setStarCount(res.stargazers_count || 0);
    };

    React.useEffect(() => {
        getStarCount();
    }, []);

    return (
        <div className="place-items-center p-10">
            <Image
                src={`https://http.cat/${code}.jpg`}
                className="w-full md:w-1/2"
                alt="503"
                width="100"
                height="100"
            />

            <div className="w-1/2 text-center mx-auto my-2">
                <h3 className="text-xl font-semibold text-white">
                    ✨ Love this project? Please consider giving it a ⭐ on GitHub! ✨
                </h3>
                <div className="mt-4 flex flex-col gap-4">

                    <button className="bg-gradient-to-r from-teal-400 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:scale-105 transition-transform"
                        onClick={() => {
                            window.open("https://github.com/thenicekat/handoutsforyou", "_blank");
                        }}
                    >
                        ⭐️ Star on GitHub ({starCount})
                    </button>
                </div>
            </div >
        </div>
    )
}