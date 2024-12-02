import React from 'react'
import Image from 'next/image'

type Props = {
    code: number
}

export default function StatusCode({ code }: Props) {
    return (
        <div className="place-items-center text-2xl p-10">
            <Image
                src={`https://http.cat/${code}.jpg`}
                className="w-full md:w-1/2"
                alt="503"
                width="100"
                height="100"
            />
        </div>
    )
}