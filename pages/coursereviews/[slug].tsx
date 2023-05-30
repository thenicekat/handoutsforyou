import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head';
import React from 'react'

export const getStaticPaths: GetStaticPaths = async () => {
    const fs = require("fs");
    const arrayOfCourses: string[] = [];

    const semsWithYears = fs.readdirSync("./public/handouts/");

    semsWithYears.forEach((sem: string) => {
        const semWiseHandouts = fs.readdirSync("./public/handouts/" + sem);
        semWiseHandouts.forEach((handout: any) => {
            handout = handout.split(".") as string[]
            arrayOfCourses.push(sem + '-' + handout[0]);
        })
    });

    const paths: { params: { slug: string } }[] = arrayOfCourses.map(course => {
        return {
            params: {
                slug: course
            }
        }
    })

    return {
        paths: paths,
        fallback: true
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const slug = params?.slug;
    return {
        props: {
            name: slug
        }
    }
}

export default function CourseReviews({ name }: any) {
    return (
        <>
            <Head>
                <title>Course Reviews.</title>
                <meta name="description" content="Handouts app for bits hyderabad" />
                <meta name="description" content="BPHC Handouts" />
                <meta name="description" content="Handouts for you." />
                <meta
                    name="description"
                    content="handouts, bits pilani hyderabad campus"
                />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className='grid place-items-center'>
                <div className='w-[50vw] place-items-center flex flex-col justify-between'>
                    <h1 className='text-6xl p-[35px]'>Course Reviews.</h1>
                    <h3 className='py-2 text-2xl'>{name.toUpperCase()}</h3>
                    <br />

                    <p>Temporarily Not Available.</p>
                </div>
            </div>
        </>
    )
}