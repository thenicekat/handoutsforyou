import GitHubButton from 'react-github-btn'
import React, { useRef } from 'react'
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

    const menuItems: any = {
        "Handouts": "/handouts",
        "Course Resources": "/courses/resources",
        "Course Reviews": "/courses/reviews",
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

    return (
        <>
            <button className="btn btn-outline w-1/2 m-3 sm:hidden" onClick={() => toggleMenu()}>
                Toggle Menu
            </button>

            <GitHubButton href="https://github.com/thenicekat/handoutsforyou"
                data-color-scheme="no-preference: light; light: light; dark: light;"
                data-icon="octicon-star"
                data-size="large"
                data-show-count="true"
                aria-label="Star thenicekat/handoutsforyou on GitHub">
                Star
            </GitHubButton>


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

            < div className="grid md:grid-cols-3 justify-around" >
                {
                    !session
                        ?
                        <div className='col-span-3'>
                            <button className="btn btn-outline m-3" onClick={() => signIn("google")}>Sign in to access</button>
                        </div>
                        :
                        <Link href={"#"} className={`m-3 col-span-3`}>
                            <button className="btn btn-error btn-outline w-full" onClick={() => signOut()}>Sign Out</button>
                        </Link>
                }
            </div >
        </>)
}

export default Menu;
