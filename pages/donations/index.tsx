import Head from "next/head";
import { useSession } from 'next-auth/react';
import Menu from "@/components/Menu";
import Link from "next/link";
import React from "react";
import { toast } from "react-toastify";

export default function Donations() {
    const { data: session } = useSession()
    const [amount, setAmount] = React.useState(0)
    const [donationsReceived, setDonationsReceived] = React.useState(0)

    const fetchDonations = async () => {
        const response = await fetch("/api/donations/get", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ amount })
        })
        const res = await response.json()
        if (res.error) {
            toast.error(res.message)
        } else {
            setDonationsReceived(res.data)
        }
    }

    const addDonation = async () => {
        const response = await fetch("/api/donations/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ amount })
        })
        const res = await response.json()
        if (res.error) {
            toast.error(res.message)
        } else {
            toast.info("Donation recorded successfully. Opening UPI app!")
            window.open(`upi://pay?pa=divyateja2004@okicici&amp;pn=Divyateja Pasupuleti&amp;cu=INR&amp;am=${amount}`, "_blank")
        }
    }

    React.useEffect(() => {
        fetchDonations()
    }, [])

    return (
        <>
            <Head>
                <title>Handouts for You.</title>
                <meta name="description" content="A website containing all bits pilani hyderabad campus handouts" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="google-adsense-account" content="ca-pub-8538529975248100" />
                <link rel="icon" href="/favicon.ico" />
            </Head>


            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-5xl pt-[50px] pb-[20px] px-[35px] text-primary">Donations.</h1>
                    <Menu />
                </div>
            </div>

            {session &&
                <div className="px-2 md:px-20">
                    <div className="grid place-items-center text-xl p-10">
                        <p className="text-3xl my-2">Total Amount Received till date: {donationsReceived ? donationsReceived : 0}</p>

                        <p className="text-center">
                            All this while handoutsforyou was free but due to some recent issues especially with storage as well as bandwidth, we require funding to keep this alive. If you feel like h4u has helped you in any way, please consider donating to keep this project alive. Even a small amount would make a difference.
                            <br /><br />
                            NOTE: You need to be on your phone to pay for the same. We promise all the amount that comes to us will be used only for this project.
                            <br /><br />
                        </p>


                        <div className="flex flex-col md:w-1/3 justify-between m-3">
                            <label htmlFor="amount" className="text-primary">Amount donated.</label>
                            <input type="text" id="amount" className="input input-secondary" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                        </div>

                        <div className="text-center flex flex-col md:w-1/3  justify-between m-1">
                            <button className="btn btn-primary" onClick={addDonation}>💸 Submit Transaction!</button>
                        </div>
                    </div>
                </div>}
        </>
    );
}
