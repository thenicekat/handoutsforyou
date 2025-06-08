import React from 'react'
import Image from 'next/image'

type Props = {
    code: number
}

export default function StatusCode({ code }: Props) {
    return (
        <div className="flex justify-center items-center p-10">
            <div className="w-full md:w-4/5">
                <Image
                    src={`https://http.cat/${code}.jpg`}
                    className="w-full rounded-lg"
                    alt={code.toString()}
                    width={800}
                    height={600}
                    quality={100}
                    priority
                />
            </div>
        </div>
    )
}
