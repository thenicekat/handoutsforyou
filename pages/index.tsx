import { useSession } from 'next-auth/react';
import Head from "next/head";
import { useEffect, useState } from "react";
import Menu from "@/components/Menu";
import CountUp from 'react-countup';
import Image from 'next/image';
import { toast } from 'react-toastify';

export default function Home() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false);
  const [summaryData, setSummaryData] = useState({
    ps1: 0,
    ps2: 0,
    reviews: 0,
    resources: 0,
    placement_ctcs: 0,
    si_data: 0,
    grading: 0
  } as {
    ps1: number,
    ps2: number,
    reviews: number,
    resources: number,
    placement_ctcs: number,
    si_data: number,
    grading: number
  });

  const fetchSummaryData = async () => {
    setIsLoading(true);
    let response = await fetch('/api/summary/data');
    let res = await response.json();
    if (res.error) {
      toast.error(res.error);
    } else {
      let result = summaryData;
      result.ps1 = res.data.ps1;
      result.ps2 = res.data.ps2;
      result.reviews = res.data.reviews;
      result.resources = res.data.resources;
      result.placement_ctcs = res.data.placement_ctcs;
      result.si_data = res.data.si_data;
      result.grading = res.data.grading;
      setSummaryData(result);
    }
    setIsLoading(false);
  }

  useEffect(() => { fetchSummaryData() }, []);


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
          <h1 className="text-6xl pt-[50px] pb-[25px] font-bold">Handouts4U.</h1>

          <Menu />
        </div>
      </div>

      {session &&
        !isLoading &&
        <div className="px-2 md:px-20 text-center">
          <span className="text-lg font-bold">Thank you! For making this project a huge success. We wouldn&apos;t be here without your support 🤍</span>

          <div className="grid md:grid-cols-4 px-10 py-10">
            <div className="ml-14">
              <Image src="/logo.svg" width={300} height={300} alt="H4U logo" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 col-span-3">
              <div className="place-items-center">
                <span className="text-5xl text-primary font-bold">
                  <CountUp end={3200} duration={3} />
                </span>
                <div className="whitespace-nowrap text-2xl"> Handouts </div>
              </div>
              <div className="place-items-center">
                <span className="text-5xl text-primary font-bold">
                  <CountUp end={summaryData.reviews} duration={3} />
                </span>
                <div className="text-2xl"> Course Reviews </div>
              </div>
              <div className="place-items-center">
                <span className="text-5xl text-primary font-bold">
                  <CountUp end={summaryData.resources} duration={3} />
                </span>
                <div className="whitespace-nowrap text-2xl"> Resources</div>
              </div>
              <div className="place-items-center px-8">
                <span className="text-5xl text-primary font-bold">
                  <CountUp end={summaryData.grading} duration={3} />
                </span>
                <div className="text-2xl"> Grading </div>
              </div>
              <div className="place-items-center">
                <span className="text-5xl text-primary font-bold">
                  <CountUp end={summaryData.placement_ctcs} duration={3} />
                </span>
                <div className="text-2xl"> Placement CTCs </div>
              </div>
              <div className="place-items-center px-8">
                <span className="text-5xl text-primary font-bold">
                  <CountUp end={summaryData.si_data} duration={3} />
                </span>
                <div className="text-2xl"> SI Data </div>
              </div>
              <div className="place-items-center px-8">
                <span className="text-5xl text-primary font-bold">
                  <CountUp end={summaryData.ps1} duration={3} />
                </span>
                <div className="text-2xl"> PS1 Responses </div>
              </div>
              <div className="place-items-center px-8">
                <span className="text-5xl text-primary font-bold">
                  <CountUp end={summaryData.ps2} duration={3} />
                </span>
                <div className="text-2xl"> PS2 Responses </div>
              </div>
            </div>
          </div>

          <br />

          Vashisth Choudhari, Anagha G, Ruban SriramBabu, Nishith Kumar, Srikant Tangirala, Mahith Tunuguntla, Anubhab Khanra, Adarsh Das, Manan Gupta, Aman Ranjan, Soham Barui, Aarsh Kulkarni, Manish Vasireddy, Sai Charan, Santrupti Behera, Varad Gorantyal, Sudhanshu Patil, Aditya Kumar, Harshit Juneja, Anirudh Agarwal, Ashna, Shubham Agrawal, Shubh Badjate, Areen Raj, Dev Gala, Dhairya Agarwal, Jason Aaron Goveas, Shivam Atul Trivedi, Nirmal Sethumadhavan, Pratyush Nair, Aryan Dalmia, Umaang Khambhati and everyone else...
        </div>
      }

      {
        isLoading && <div className="grid place-items-center">
          <p className="text-xl m-3">Loading...</p>
        </div>
      }
    </>
  );
}
