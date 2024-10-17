import React from 'react'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'

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
    const [menu, setMenu] = React.useState(false)
    const [starCount, setStarCount] = React.useState(0)

    const menuItems: any = {
        "Handouts": "/handouts",
        "Course Resources": "/courses/resources",
        "Course Reviews": "/courses/reviews",
        "Course Grading": "/courses/grading",
        "Summer Internships": "/si",
        "Research Chronicles": "https://pollen-box-786.notion.site/Research-Chronicles-894bcac1266d4e5fac2f4cd76ff29750",
        "Rants": "/rants",
        "Placements": "/placements",
        "Practice School": "/ps",
        "Course Prereqs": "/courses/prereqs",
        "Minor Courses": "/minors.html",
    }

    const toggleMenu = () => {
        setMenu(!menu)
    }

    const getStarCount = async () => {
        const response = await fetch("https://api.github.com/repos/thenicekat/handoutsforyou")
        const res = await response.json()
        return res.stargazers_count
    }

    React.useEffect(() => {
        getStarCount().then((count) => setStarCount(count))
    }, [])

    return (
        <>
            <Link className="m-3 grid grid-cols-1 justify-around" href={"#"}>
                <button className="btn btn-outline w-full sm:hidden" onClick={() => toggleMenu()}>
                    {!menu ? "Open" : "Close"} the menu
                </button>
            </Link>

            <div className={`${menu ? 'grid' : 'hidden'} sm:grid md:grid-cols-5 sm:grid-cols-3 justify-around`}>
                {Object.keys(menuItems).map(
                    (menuItem) =>
                        <Link className="m-3" href={menuItems[menuItem]} key={menuItems[menuItem]}>
                            <button className="btn btn-outline w-full uppercase">
                                {menuItem}
                            </button>
                        </Link>
                )}
            </div>

            <div className="grid md:grid-cols-2 justify-around" >
                <>
                    <Link className="m-3" href="https://github.com/thenicekat/handoutsforyou">
                        <button className="btn btn-outline btn-accent w-full">
                            Star on GitHub! ({starCount})
                        </button>
                    </Link>

                    {
                        !session ?
                            <Link className="m-3" href={"#"}>
                                <button className="btn btn-warning btn-outline w-full" onClick={() => signIn("google")}>Sign In</button>
                            </Link>
                            :
                            <Link className="m-3" href={"#"}>
                                <button className="btn btn-warning btn-outline w-full" onClick={() => signOut()}>Sign Out</button>
                            </Link>
                    }
                </>

            </div >
        </>)
}

export default Menu;
