import React from 'react'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import { EllipsisHorizontalCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import Modal from './Modal';

if (
    typeof window !== "undefined" &&
    typeof window.navigator !== "undefined" &&
    typeof navigator !== "undefined" &&
    navigator.userAgent
) {
    const disableDevtool = require("disable-devtool");
    if (process.env.NEXT_PUBLIC_PRODUCTION === "1") disableDevtool();
}


const Menu = () => {
    const { data: session } = useSession()
    const [mobileMenu, setMobileMenu] = React.useState(false)
    const [starCount, setStarCount] = React.useState(0)

    const [starPromptOpen, setStarPromptOpen] = React.useState(false)

    const menuItems: any = {
        "Handouts": "/handouts",
        "Course Prereqs": "/courses/prereqs",
        "Course Resources": "/courses/resources",
        "Course Reviews": "/courses/reviews",
        "Midsem Grading": "/courses/grading",
        "Summer Internships": "/si",
        "SI Companies": "/si/companies",
        "Research Chronicles": "https://pollen-box-786.notion.site/Research-Chronicles-894bcac1266d4e5fac2f4cd76ff29750",
        "Placements": "/placements",
        "Placement CTCs": "/placements/ctcs",
        "Practice School": "/ps/",
        "PS Chronicles": "/ps/chronicles",
        "Minor Courses": "/minors.html",
    }

    const toggleMobileMenu = () => {
        setMobileMenu(!mobileMenu)
    }

    const getStarCount = async () => {
        const response = await fetch("https://api.github.com/repos/thenicekat/handoutsforyou")
        const res = await response.json()
        return res.stargazers_count
    }

    React.useEffect(() => {
        getStarCount().then((count) => setStarCount(count))

        let localStarPromptStore = localStorage.getItem("starPromptStore")
        if (localStarPromptStore == null) {
            console.info("Local storage not found, creating one")
            let jsonString = JSON.stringify({ lastPrompt: Date.now() })
            localStorage.setItem("starPromptStore", jsonString)
            setStarPromptOpen(true)
        } else {
            const { lastPrompt } = JSON.parse(localStarPromptStore)
            console.info("Local storage found, checking for prompt. Last prompt: " + lastPrompt)
            if (Date.now() - lastPrompt >= 2 * 24 * 60 * 60 * 1000) {
                let jsonString = JSON.stringify({ lastPrompt: Date.now() })
                localStorage.setItem("starPromptStore", jsonString)
                setStarPromptOpen(true)
            }
        }
    }, [])

    return (
        <>
            {/* Star wala modal */}
            <Modal open={starPromptOpen}>
                <h3 className="text-lg">
                    ✨ If you find this project helpful, please consider giving it a ⭐ on GitHub! ✨
                    Your support would mean a lot to the team! 🙌
                </h3>
                <div className="text-primary m-3 gap-3">
                    <Link href="https://github.com/thenicekat/handoutsforyou">
                        <button className="m-2 btn btn-success w-full" tabIndex={-1}>
                            ⭐️ Star on Github ({starCount})
                        </button>
                    </Link>

                    <button className="m-2 btn btn-success w-full" tabIndex={-1} onClick={() => setStarPromptOpen(false)}>
                        Close
                    </button>
                </div>
            </Modal>

            {/* Mobile Menu */}
            <div
                className="z-50 w-14 fixed bottom-9 md:top-0 right-0 m-4 cursor-pointer text-white"
                onClick={() => {
                    toggleMobileMenu()
                }}>
                {!mobileMenu ? <EllipsisHorizontalCircleIcon /> : <XCircleIcon />}
            </div>
            <div>
                {mobileMenu && (
                    <div className="fixed overflow-y-scroll top-0 left-0 w-full h-full text-white bg-gradient-to-r from-slate-700 to-slate-900 z-30 text-center">
                        <h1 className="text-5xl pt-[50px] pb-[25px] text-primary font-bold">Menu.</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 justify-around text-2xl">
                            {Object.keys(menuItems).map(
                                (menuItem) =>
                                    <Link
                                        className="m-3 transition ease-in-out delay-100 hover:scale-125 duration-200"
                                        href={menuItems[menuItem]}
                                        key={menuItems[menuItem]}
                                    >
                                        {menuItem}
                                    </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 justify-around" >
                <>
                    <Link className="m-3" href="https://github.com/thenicekat/handoutsforyou">
                        <button className="btn btn-success w-full" tabIndex={-1}>
                            ⭐️ Star on Github ({starCount})
                        </button>
                    </Link>

                    {
                        !session ?
                            <Link className="m-3" href={"#"}>
                                <button className="btn btn-warning btn-outline w-full" onClick={() => signIn("google")} tabIndex={-1}>Sign In</button>
                            </Link>
                            :
                            <Link className="m-3" href={"#"}>
                                <button className="btn btn-warning btn-outline w-full" onClick={() => signOut()} tabIndex={-1}>Sign Out</button>
                            </Link>
                    }
                </>

            </div >
        </>)
}

export default Menu;
