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
    si_chronicles: 0,
    si_companies: 0
  } as {
    ps1: number,
    ps2: number,
    reviews: number,
    resources: number,
    placement_ctcs: number,
    si_chronicles: number,
    si_companies: number
  });

  const fetchSummaryData = async () => {
    setIsLoading(true);
    let response = await fetch('/api/summary/data');
    let res = await response.json();
    if (res.error) {
      toast.error(res.error);
    } else {
      let result = summaryData;
      result.ps1 = res.data.ps1.count;
      result.ps2 = res.data.ps2.count;
      result.reviews = res.data.reviews.count;
      result.resources = res.data.resources.count;
      result.placement_ctcs = res.data.placement_ctcs.count;
      result.si_chronicles = res.data.si_chronicles.count;
      result.si_companies = res.data.si_companies.count;
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


      {/* Search box */}
      <div className="grid place-items-center">
        <div className="w-[70vw] place-items-center flex flex-col justify-between">
          <h1 className="text-5xl pt-[50px] pb-[20px] px-[35px] text-primary">Handouts for You.</h1>

          <Menu />
        </div>
      </div>

      {session &&
        !isLoading &&
        <div className="px-2 md:px-20 text-center">
          Thank you! For making this project a huge success. We wouldn&apos;t be here without your support.

          <br /><br />

          <div className='grid md:grid-cols-2'>
            <div>
              <div className="grid place-items-center">
                <Image src="/logo.svg" width={300} height={300} alt="H4U logo" />
              </div>
            </div>
            <div>
              <span className="text-3xl text-primary"><CountUp end={3200} duration={3} />+ Handouts</span>
              <br />
              <span className="text-3xl text-primary"><CountUp end={summaryData.reviews} duration={3} /> Course Reviews</span>
              <br />
              <span className="text-3xl text-primary"><CountUp end={summaryData.resources} duration={3} /> Resources</span>
              <br />
              <span className="text-3xl text-primary"><CountUp end={summaryData.placement_ctcs} duration={3} /> Placement CTCs</span>
              <br />
              <span className="text-3xl text-primary"><CountUp end={summaryData.si_chronicles} duration={3} /> SI Chronicles</span>
              <br />
              <span className="text-3xl text-primary"><CountUp end={summaryData.si_companies} duration={3} /> SI Companies</span>
              <br />
              <span className="text-3xl text-primary"><CountUp end={summaryData.ps1} duration={3} /> PS1 Responses</span>
              <br />
              <span className="text-3xl text-primary"><CountUp end={summaryData.ps2} duration={3} /> PS2 Responses</span>
            </div>
          </div>

          <br /><br />

          Vashisth Choudhari, Anagha G, Ruban SriramBabu, Nishith Kumar, Srikant Tangirala, Mahith Tunuguntla, Anubhab Khanra, Adarsh Das, Manan Gupta, Aman Ranjan, Soham Barui, Aarsh Kulkarni, Manish Vasireddy, Sai Charan, Santrupti Behera, Varad Gorantyal, Sudhanshu Patil, Aditya Kumar, Harshit Juneja, Anirudh Agarwal, Ashna, Shubham Agrawal, Shubh Badjate, Areen Raj, Dev Gala, Dhairya Agarwal, Jason Aaron Goveas, Shivam Atul Trivedi and everyone else...
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
