import React from 'react'
import Link from 'next/link'

type Props = {
    current: String
}

const Menu = (props: Props) => {
    return (
        <>
            <p>Made with &lt;3 by{' '}
                <Link
                    className="text-black underline"
                    href={"mailto:f20210075@hyderabad.bits-pilani.ac.in"}
                >
                    Divyateja Pasupuleti
                </Link>
                , {' '}
                <Link
                    className="text-black underline"
                    href={"mailto:f20211989@hyderabad.bits-pilani.ac.in"}
                >
                    Vashisth Choudhari
                </Link>
                {' '}and{' '}
                <Link
                    className="text-black underline"
                    href={"mailto:f20190097h@alumni.bits-pilani.ac.in"}
                >
                    Ruban S
                </Link>
            </p>


            <div className="py-3 items-center justify-around">
                <Link className="m-5" href={"/minors.html"}>
                    <button className="btn btn-outline">
                        Info. about Minors
                    </button>
                </Link>
                {
                    props.current != "home" && <Link className="m-5" href={"/"}>
                        <button className="btn btn-outline">
                            Home
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
        </>)
}

export default Menu;