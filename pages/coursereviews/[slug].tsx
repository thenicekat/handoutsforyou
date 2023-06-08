import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head';
import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/react';
import { supabase } from '../api/supabase';
import { ParsedUrlQuery } from 'querystring';

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
        fallback: false
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const slug = (params as ParsedUrlQuery).slug;
    const { data, error } = await supabase.from('reviews').select("*").eq('coursename', slug)

    if (error != null) {
        console.log(error)
        return {
            props: {
                name: slug,
                err: true,
                errMsg: error.message
            }
        }
    }

    return {
        props: {
            name: slug,
            data: data,
            err: false
        }
    }
}

export default function CourseReviews({ name, data, err, errMsg }: {
    name: string,
    data: { id: number, review: string, coursename: string, created_at: string, created_by: string }[],
    err: boolean,
    errMsg: string
}) {
    const { data: session } = useSession()
    const [review, setReview] = React.useState('')
    const [errorWhileSubmit, setErrorWhileSubmit] = React.useState('');
    const [successWhileSubmit, setSuccessWhileSubmit] = React.useState(false);

    const submitReview = async () => {
        setErrorWhileSubmit('')
        setSuccessWhileSubmit(false)

        const { error } = await supabase.from('reviews').insert({
            coursename: name,
            review: review,
            created_by: session?.user?.email
        })

        if (error != null) {
            console.log(error)
            setErrorWhileSubmit(error.message)
        } else {
            setSuccessWhileSubmit(true)
        }
    }

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
                    {
                        (err != false) ? <p>{errMsg}</p> : !session
                            ?
                            <>
                                <p className='text-2xl'>You will need to sign in to access these pages.</p>
                                <button className="btn btn-outline btn-primary" onClick={() => signIn()}>Sign in</button>
                            </>
                            :
                            <>
                                <div className='flex'>
                                    <label htmlFor="my-modal-6" className="btn btn-outline btn-primary m-3">Add Review</label>

                                    {/* Put this part before </body> tag */}
                                    <input type="checkbox" id="my-modal-6" className="modal-toggle" />
                                    <div className="modal modal-bottom sm:modal-middle">
                                        <div className="modal-box">
                                            <h3 className="font-bold text-lg">Add your own review</h3>
                                            <textarea className="textarea textarea-bordered w-full my-4" placeholder="Enter Review Here" value={review} onChange={(e) => setReview(e.target.value)}></textarea>

                                            {errorWhileSubmit.length > 0 && <div className="alert alert-error shadow-lg">
                                                <div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    <span>{errorWhileSubmit}.</span>
                                                </div>
                                            </div>}

                                            {successWhileSubmit && <div className="alert alert-success shadow-lg">
                                                <div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    <span>Successfully Submitted!</span>
                                                </div>
                                            </div>}

                                            <div className="modal-action">
                                                <button className="btn btn-outline btn-primary m-3" onClick={submitReview}>Submit!</button>
                                                <label htmlFor="my-modal-6" className="btn btn-outline btn-primary m-3">Close</label>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="btn btn-outline btn-primary m-3" onClick={() => signOut()}>Sign Out</button>
                                </div>

                                {data.map(review => {
                                    return <div className="alert shadow-lg" key={review.id}>
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            <div>
                                                <div className="text-lg">{review.review}</div>
                                            </div>
                                        </div>
                                        <div className="flex-none">
                                            <button className="btn btn-sm" disabled>{review.created_by}</button>
                                        </div>
                                    </div>
                                })}
                            </>
                    }


                </div>
            </div>

        </>
    )
}