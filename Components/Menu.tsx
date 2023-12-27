import React from 'react'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import Footer from './Footer'

type Props = {
    current: String
}

const Menu = (props: Props) => {
    const { data: session } = useSession()
    const [menu, setMenu] = React.useState(false)

    const toggleMenu = () => {
        setMenu(!menu)
    }

    return (
        <>
            <button className="btn btn-outline w-1/4 m-3 md:hidden" onClick={() => toggleMenu()}>
                Menu
            </button>

            <div className={`${menu ? 'grid' : 'hidden'} md:grid md:grid-cols-4 justify-around`}>
                <Link className="m-3" href={"/"}>
                    <button className="btn btn-outline w-full">
                        Handouts
                    </button>
                </Link>

                <Link className="m-3" href={"/notes"}>
                    <button className="btn btn-outline w-full">
                        Notes and Resources
                    </button>
                </Link>

                <Link className="m-3" href={"/courses/reviews"}>
                    <button className="btn btn-outline w-full">
                        Course Reviews
                    </button>
                </Link>

                <Link className="m-3" href={"/si"}>
                    <button className="btn btn-outline w-full">
                        Summer Internships
                    </button>
                </Link>

                <Link className="m-3" href={"mailto:f20210075@hyderabad.bits-pilani.ac.in"} target='_blank'>
                    <button className="btn btn-outline w-full">
                        Add your Content
                    </button>
                </Link>

                <Link className="m-3" href={"/ps"}>
                    <button className="btn btn-outline w-full">
                        Practice School
                    </button>
                </Link>

                <Link className="m-3" href={"/courses/prereqs"}>
                    <button className="btn btn-outline w-full">
                        Course Prereqs
                    </button>
                </Link>

                <Link className="m-3" href={"/minors.html"}>
                    <button className="btn btn-outline w-full">
                        Info. about Minors
                    </button>
                </Link>
            </div>

            <div className="grid md:grid-cols-3 justify-around">
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
            </div>
        </>)
}

export default Menu;