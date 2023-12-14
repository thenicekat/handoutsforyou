import Link from 'next/link'
import React from 'react'

type Props = {}

export default function Footer({ }: Props) {
    return (
        <div className='place-items-center text-center m-5'>
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
                    Mahith T
                </Link>
                <br />
            </p>
        </div>
    )
}