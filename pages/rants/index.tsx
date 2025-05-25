import Head from "next/head";
import { useEffect, useState } from "react";
import Menu from "@/components/Menu";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import CustomToastContainer from "@/components/ToastContainer";
import { toast } from "react-toastify";
import { Rant } from "@/types/Rant";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";

export default function Rants() {
    const [isLoading, setIsLoading] = useState(false);
    const [rants, setRants] = useState([] as Rant[]);
    const [newComments, setNewComments] = useState<{ [key: number]: string }>({});
    const { session } = useAuth();

    const fetchRants = async () => {
        setIsLoading(true)
        const res = await fetch("/api/rants/get", {
            method: "POST",
            body: JSON.stringify({}),
            headers: { "Content-Type": "application/json" }
        })
        if (res.status !== 400) {
            const rants = await res.json()
            if (rants.error && rants.status !== 400) {
                toast.error(rants.message)
                setIsLoading(false)
            } else {
                setRants(rants.data.reverse())
                setIsLoading(false)
            }
        }
    }

    const handleCommentChange = (rantId: number, comment: string) => {
        setNewComments(prev => ({
            ...prev,
            [rantId]: comment
        }));
    };

    const submitComment = async (rantId: number) => {
        if (!newComments[rantId] || newComments[rantId].trim() === '') {
            toast.error('Comment cannot be empty');
            return;
        }

        try {
            const res = await fetch("/api/rants/comment", {
                method: "POST",
                body: JSON.stringify({
                    rantId,
                    comment: newComments[rantId]
                }),
                headers: { "Content-Type": "application/json" }
            });

            const data = await res.json();

            if (data.error) {
                toast.error(data.message || 'Failed to add comment');
            } else {
                toast.success('Comment added successfully');

                // Clear the comment input
                setNewComments(prev => ({
                    ...prev,
                    [rantId]: ''
                }));

                // Fetch updated rants but only update the comments for this specific rant
                const res = await fetch("/api/rants/get", {
                    method: "POST",
                    body: JSON.stringify({}),
                    headers: { "Content-Type": "application/json" }
                });

                if (res.ok) {
                    const rantsData = await res.json();
                    if (!rantsData.error) {
                        // Find the updated rant with new comments
                        const updatedRant = rantsData.data.find((r: any) => r.id === rantId);

                        if (updatedRant) {
                            // Update only the comments for this specific rant
                            setRants(currentRants =>
                                currentRants.map(rant =>
                                    rant.id === rantId
                                        ? { ...rant, rants_comments: updatedRant.rants_comments }
                                        : rant
                                )
                            );
                        }
                    }
                }
            }
        } catch (error) {
            toast.error('Failed to add comment');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchRants()
    }, [])

    return (
        <>
            <Head>
                <title>Rants.</title>
                <meta name="description" content="One stop place for your PS queries, handouts, and much more" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics, practice school, ps, queries, ps cutoffs, ps2, ps1" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">Rants.</h1>

                    <Menu />

                    {session && <>
                        <span className="m-2"></span>

                        <div className="flex flex-col md:flex-row w-1/2 justify-center">
                            <Link className="w-full hidden md:block" href={"/rants/add"}>
                                <button className="btn btn-outline w-full" tabIndex={-1}>
                                    Add a Rant
                                </button>
                            </Link>
                        </div>
                        <div className="z-10 w-14 fixed bottom-3 left-0 m-4 cursor-pointer text-white md:hidden">
                            <Link className="m-3 w-full" href={"/rants/add"}>
                                <PlusCircleIcon />
                            </Link>
                        </div>

                    </>}
                </div>
            </div>

            {session &&
                <div>
                    <div className='px-2 md:px-20 p-2'>
                        {
                            !isLoading ?
                                rants
                                    .map((rant) => (
                                        <div className="card shadow-xl bg-base-100 break-words text-base-content mt-7 hover:shadow-2xl transition-shadow duration-300" key={rant.created_at}>
                                            <div className="card-body">
                                                <div className="flex flex-wrap items-center justify-between mb-2">
                                                    <div className="badge badge-outline my-2 px-3">Rant #{rant.id} | {rant.public == 1 ? "Public" : "Private"}</div>
                                                    <span className="text-xs italic">
                                                        {new Date(rant.created_at).toLocaleString("en-IN", {})}
                                                    </span>
                                                </div>

                                                <div className="p-4 rounded-lg my-2">
                                                    <p className="whitespace-pre-wrap">{rant.rant}</p>
                                                </div>

                                                {/* Comments section */}
                                                <div className="mt-4 border-t pt-3">
                                                    <h3 className="font-medium text-sm flex items-center gap-2">
                                                        <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4" />
                                                        <span>Comments</span>
                                                        {rant.rants_comments &&
                                                            <span className="badge badge-sm">{rant.rants_comments.length}</span>
                                                        }
                                                    </h3>

                                                    {(!rant.rants_comments || rant.rants_comments.length === 0) ? (
                                                        <p className="text-sm text-gray-500 italic mt-2">No comments yet</p>
                                                    ) : (
                                                        <div className="border-l-2 border-primary pl-4 mt-2 space-y-3">
                                                            {rant.rants_comments.map((comment, index) => (
                                                                <div key={index} className="bg-base-200 p-3 rounded-lg text-sm">
                                                                    <p className="whitespace-pre-wrap">{comment.comment}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Add comment form */}
                                                    <div className="mt-4">
                                                        <div className="flex gap-2">
                                                            <textarea
                                                                className="textarea textarea-bordered w-full text-sm"
                                                                placeholder="Write a comment..."
                                                                value={newComments[rant.id] || ''}
                                                                onChange={(e) => handleCommentChange(rant.id, e.target.value)}
                                                                rows={1}
                                                            ></textarea>
                                                            <button
                                                                className="btn btn-primary btn-sm"
                                                                onClick={() => submitComment(rant.id)}
                                                                disabled={!newComments[rant.id] || newComments[rant.id].trim() === ''}
                                                            >
                                                                Post
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )) :
                                <div className="flex justify-center">
                                    <h1 className="text-3xl text-primary">Loading...</h1>
                                </div>
                        }
                    </div>
                </div>
            }
            <CustomToastContainer containerId="rants" />
        </>
    )
}
