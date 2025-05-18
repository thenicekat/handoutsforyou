import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import Head from "next/head";
import CustomToastContainter from "@/components/ToastContainer"
import Menu from "@/components/Menu";
import { useRouter } from "next/router";


export default function AddTestimonial({ }: {}) {
    const router = useRouter();
    const { userId } = router.query;

    const [testimonial, setTestimonial] = useState("");

    const { session } = useAuth()

    const AddTestimonial = async () => {
        toast.info("Sending your testimonial. Please wait...")
        if (!userId) {
            toast.error("You need a user id!")
            return
        }
        if (testimonial == "") {
            toast.error("Please fill testimonial!")
            return
        }
        if (!session || !session.user) {
            toast.error("Please login to add a testimonial!")
            return
        }

        const data = await fetch("/api/testimonials/add", {
            method: "POST",
            body: JSON.stringify({
                userId: userId,
                testimonial: testimonial,
            }),
            headers: { "Content-Type": "application/json" }
        })
        const res = await data.json()
        if (res.error) {
            toast.error(res.message)
        }
        else {
            toast.success("Thank you! Your testimonial was added successfully!")
            setTestimonial("")
        }
    }

    const AddTestimonialSets = async () => {
        if (!userId) {
            toast.error("You need a user id!")
            return
        }
        if (testimonial == "") {
            toast.error("Please fill testimonial!")
            return
        }
        if (!session || !session.user) {
            toast.error("Please login to add a testimonial!")
            return
        }

        // Split at word boundaries near 500 characters.
        const sets = []
        let remainingText = testimonial

        while (remainingText.length > 0) {
            if (remainingText.length <= 490) {
                // Last piece is under the limit
                sets.push(remainingText)
                break
            }

            // Find the last space within 490 characters (leaving room for part numbers).
            let cutIndex = 490
            while (cutIndex > 0 && remainingText[cutIndex] !== ' ') {
                cutIndex--
            }

            // If no space found, fall back to hard cut at 490.
            if (cutIndex === 0) {
                cutIndex = 490
            }

            // Add this chunk and continue with remainder.
            sets.push(remainingText.substring(0, cutIndex))
            remainingText = remainingText.substring(cutIndex).trim()
        }

        // Track success for feedback.
        let successCount = 0
        let hasError = false

        // Send each chunk with part numbers.
        for (let i = 0; i < sets.length; i++) {
            const partNumber = `[${i + 1}/${sets.length}] `;
            const testimonialWithPart = partNumber + sets[i];

            const data = await fetch("/api/testimonials/add", {
                method: "POST",
                body: JSON.stringify({
                    userId: userId,
                    testimonial: testimonialWithPart,
                }),
                headers: { "Content-Type": "application/json" }
            })
            const res = await data.json()
            if (res.error) {
                toast.error(`Error sending part ${i + 1}/${sets.length}: ${res.message}`)
                hasError = true
            } else {
                successCount++
                toast.success(`Part ${i + 1}/${sets.length} sent successfully!`)
            }
        }

        if (hasError) {
            toast.warning(`Sent ${successCount} of ${sets.length} parts successfully`)
        } else if (sets.length > 1) {
            toast.success(`All ${sets.length} parts sent successfully!`)
            setTestimonial("")
        } else {
            toast.success("Thank you! Your review was added successfully!")
            setTestimonial("")
        }
    }


    return (
        <>
            <Head>
                <title>Testimonials.</title>
                <meta name="description" content="One stop place for your PS queries, handouts, and much more" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics, practice school, ps, queries, ps cutoffs, ps2, ps1" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">Testimonials.</h1>

                    <Menu />

                    {session && <>
                        <span className="m-2"></span>

                        <p className="text-sm">You are writing for user ID: {userId}</p>
                        <br />
                        <p className="text-sm">This is a wrapper on top of the yearbook website. The yearbook website actually enforces a limit of 500 chars, but this does not. Do not blame me if the testimonial does not get printed completely. You should probably just use the split testimonial into parts feature.</p>


                        <div className="text-center w-full m-2 h-60">
                            <textarea
                                className="textarea textarea-primary w-full max-w-xl h-full"
                                placeholder="Enter your Testimonial..."
                                onChange={(e) => setTestimonial(e.target.value)}
                                value={testimonial}
                            ></textarea>
                        </div>
                        <p className="text-md">Character Count: {testimonial.length}</p>
                        <br />

                        <div className="collapse collapse-arrow bg-base-200 m-2">
                            <input type="checkbox" />
                            <div className="collapse-title text-md font-medium">How to find your user id?</div>
                            <div className="collapse-content">
                                <p>To find your user id, you can ask any one you sent request to, to click on the write for you button and then it should show a number in the url bar. You can also ask any junior and senior to send the url they got, it should be simple to figure it out from there. </p>
                            </div>
                        </div>

                        <div className="text-center flex-wrap w-3/4 justify-between m-1">
                            <button
                                className="btn btn-primary"
                                onClick={AddTestimonial}
                            >
                                Add Testimonial
                            </button>
                            <br />
                            <br />
                            <button
                                className="btn btn-primary"
                                onClick={AddTestimonialSets}
                                disabled={testimonial.length < 500}
                            >
                                Send in sets of 500 chars.
                            </button>
                        </div>
                    </>}
                </div>
            </div>

            <CustomToastContainter containerId="addTestimonials" />
        </>
    )
}