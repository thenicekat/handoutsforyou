import Link from 'next/link'
import React from 'react'

type Props = {}

export default function Footer({ }: Props) {
    return (
        <footer className="fixed bottom-0 bg-white flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6">
            <p className="text-xs text-gray-500">
                © 2024 Divyateja Pasupuleti. All rights reserved.
            </p>
        </footer>
    )
}