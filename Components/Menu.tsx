import React, { useRef } from 'react'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import Footer from './Footer'
import AutoCompleter from './AutoCompleter'
import classNames from 'classnames'

type Props = {
    current: String
}

const Menu = (props: Props) => {
    const { data: session } = useSession()
    const [menu, setMenu] = React.useState(false)

    const menuItems: any = {
        "Handouts": "/",
        "Notes and Resources": "/notes",
        "Course Reviews": "/courses/reviews",
        "Summer Internships": "/si",
        "Add your Content": "https://forms.gle/5Q2Ek3TNGmAx2Rn46",
        "Practice School": "/ps",
        "Course Prereqs": "/courses/prereqs",
        "Info. about Minors": "/minors.html"
    }

    const toggleMenu = () => {
        setMenu(!menu)
    }

    return (
        <>
            <button className="btn btn-outline w-1/4 m-3 md:hidden" onClick={() => toggleMenu()}>
                Menu
            </button>

            <div className={`${menu ? 'grid' : 'hidden'} md:grid md:grid-cols-4 justify-around`}>
                {Object.keys(menuItems).map(
                    (menuItem) =>
                        <Link className="m-3" href={menuItems[menuItem]}>
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
                            <button className="btn btn-outline w-full" onClick={() => signOut()}>Sign Out</button>

                        </Link>
                }
            </div >
        </>)
}

export default Menu;