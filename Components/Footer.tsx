import Link from 'next/link'
import React from 'react'

type Props = {}

export default function Footer({ }: Props) {
    return (
        <div className='place-items-center text-center p-5 mt-2 bottom-0 fixed w-full bg-white text-black'>
            <p>Made with &lt;3 by{' '}
                <Link
                    className="underline"
                    href={"mailto:f20210075@hyderabad.bits-pilani.ac.in"}
                >
                    Divyateja Pasupuleti
                </Link>
                , {' '}
                <Link
                    className="underline"
                    href={"mailto:f20211989@hyderabad.bits-pilani.ac.in"}
                >
                    Vashisth Choudhari
                </Link>
                {' '}and{' '}
                <Link
                    className="underline"
                    href={"mailto:f20190097h@alumni.bits-pilani.ac.in"}
                >
                    Ruban S
                </Link>
                {' '}and{' '}
                <Link
                    className="underline"
                    href={"mailto:f20190441h@alumni.bits-pilani.ac.in"}
                >
                    Mahith T
                </Link>
                <br />
            </p>
        </div>
    )
}