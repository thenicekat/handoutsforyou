import React from 'react'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'

type Props = {
    current: String
}

const Menu = (props: Props) => {
    const { data: session } = useSession()

    return (
        <>
            <p>Made with &lt;3 by{' '}
                <Link
                    className="text-white underline"
                    href={"mailto:f20210075@hyderabad.bits-pilani.ac.in"}
                >
                    Divyateja Pasupuleti
                </Link>
                , {' '}
                <Link
                    className="text-white underline"
                    href={"mailto:f20211989@hyderabad.bits-pilani.ac.in"}
                >
                    Vashisth Choudhari
                </Link>
                {' '}and{' '}
                <Link
                    className="text-white underline"
                    href={"mailto:f20190097h@alumni.bits-pilani.ac.in"}
                >
                    Ruban S
                </Link>
                {' '}and{' '}
                <Link
                    className="text-white underline"
                    href={"mailto:f20190441h@alumni.bits-pilani.ac.in"}
                >
                    Mahith
                </Link>
                <br />
            </p>


            <div className="grid md:grid-cols-3 justify-around">
                <Link className="m-3" href={"/minors.html"}>
                    <button className="btn btn-outline w-full">
                        Info. about Minors
                    </button>
                </Link>
                {
                    <Link className="m-3" href={"/notes"}>
                        <button className="btn btn-outline w-full">
                            Notes and Resources
                        </button>
                    </Link>
                }
                {
                    <Link className="m-3" href={"/faqs"}>
                        <button className="btn btn-outline w-full">
                            FAQs about Campus
                        </button>
                    </Link>
                }
                {
                    <Link className="m-3" href={"/si"}>
                        <button className="btn btn-outline w-full">
                            Summer Internships
                        </button>
                    </Link>
                }
                {
                    <Link className="m-3" href={"https://forms.gle/eTtfHgthEUZtr5GW6"}>
                        <button className="btn btn-outline w-full">
                            Add your Content
                        </button>
                    </Link>
                }
                {
                    <Link className="m-3" href={"/ps"}>
                        <button className="btn btn-outline w-full">
                            Practice School
                        </button>
                    </Link>
                }
            </div>

            <div className="grid place-items-center">
                {
                    !session
                        ?
                        <>
                            <p className='text-xl'>You will need to sign in to access these pages.</p>
                            <button className="btn btn-outline btn-primary m-3" onClick={() => signIn("google")}>Sign in</button>
                        </>
                        : <div>
                            <button className="btn btn-outline btn-primary m-3" onClick={() => signOut()}>Sign Out</button>
                            <Link className="m-3" href={"/"}>
                                <button className="btn btn-outline btn-primary m-3">
                                    Home
                                </button>
                            </Link>
                        </div>
                }
            </div>
        </>)
}

export default Menu;