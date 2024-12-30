import Link from 'next/link'
import React from 'react'

type Props = {}

export default function Footer({ }: Props) {
    return (
        <footer className="fixed bottom-0 bg-white flex flex-col sm:flex-row py-3 w-full shrink-0 items-center px-4 md:px-6">
            <p className="text-xs text-gray-500">
                Made with love by <Link
                    href={"https://thenicekat.github.io/"}
                    className='underline'
                >
                    Divyateja Pasupuleti
                </Link>
                {' '}🖤
            </p>
        </footer>
    )
}