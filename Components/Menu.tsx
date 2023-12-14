import React from 'react'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import Footer from './Footer'

type Props = {
    current: String
}

const Menu = (props: Props) => {
    const { data: session } = useSession()

    return (
        <>
            <div className="grid md:grid-cols-4 justify-around">
                <Link className="m-3" href={"/minors.html"}>
                    <button className="btn btn-outline w-full">
                        Info. about Minors
                    </button>
                </Link>

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

                <Link className="m-3" href={"/faqs"}>
                    <button className="btn btn-outline w-full">
                        FAQs about Campus
                    </button>
                </Link>

                <Link className="m-3" href={"/si"}>
                    <button className="btn btn-outline w-full">
                        Summer Internships
                    </button>
                </Link>

                <Link className="m-3" href={"https://forms.gle/eTtfHgthEUZtr5GW6"} target='_blank'>
                    <button className="btn btn-outline w-full">
                        Add your Content
                    </button>
                </Link>

                <Link className="m-3" href={"/ps"}>
                    <button className="btn btn-outline w-full">
                        Practice School
                    </button>
                </Link>

                <Link className="m-3" href={"/prereqs"}>
                    <button className="btn btn-outline w-full">
                        Course Prereqs
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