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
                <a href="https://forms.gle/eTtfHgthEUZtr5GW6">Add your own content.</a>
            </p>


            <div className="grid md:grid-cols-3">
                <Link className="m-5" href={"/minors.html"}>
                    <button className="btn btn-outline">
                        Info. about Minors
                    </button>
                </Link>
                {
                    props.current != "home" && <Link className="m-5" href={"/"}>
                        <button className="btn btn-outline">
                            Go Back to Home
                        </button>
                    </Link>
                }
                {
                    props.current != "notes" && <Link className="m-5" href={"/notes"}>
                        <button className="btn btn-outline">
                            Notes and Resources
                        </button>
                    </Link>
                }
                {
                    props.current != "faqs" && <Link className="m-5" href={"/faqs"}>
                        <button className="btn btn-outline">
                            FAQs about Campus
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
                        : <button className="btn btn-outline btn-primary m-3" onClick={() => signOut()}>Sign Out</button>
                }
            </div>
        </>)
}

export default Menu;