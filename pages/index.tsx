import Head from "next/head";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from 'next-auth/react';
import CountUp from 'react-countup';
import Image from 'next/image';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false);
  const [starCount, setStarCount] = useState(0);
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

    const githubResponse = await fetch("https://api.github.com/repos/thenicekat/handoutsforyou");
    const githubRes = await githubResponse.json();
    setStarCount(githubRes.stargazers_count || 0);

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

  const navigationCategories = [
    {
      title: "Academic Resources.",
      description: "Access course materials, handouts, and academic resources",
      items: [
        { name: "Handouts", path: "/handouts" },
        { name: "Prerequisites", path: "/courses/prereqs" },
        { name: "PYQs", path: "/courses/pyqs" },
        { name: "Reviews", path: "/courses/reviews" },
        { name: "Resources", path: "/courses/resources" },
        { name: "Grading", path: "/courses/grading" }
      ]
    },
    {
      title: "Placement Resources.",
      description: "Explore placement information and opportunities",
      items: [
        { name: "Placement CTCs", path: "/placements/ctcs" },
        { name: "Placement Resources", path: "/placements" },
        { name: "SI Resources", path: "/si" },
        { name: "SI Companies", path: "/si/companies" },
        { name: "Research Chronicles", path: "https://pollen-box-786.notion.site/Research-Chronicles-894bcac1266d4e5fac2f4cd76ff29750" },
        { name: "Higher Studies", path: "/higherstudies/resources" }
      ]
    },
    {
      title: "Practice School.",
      description: "Find information about PS stations and experiences",
      items: [
        { name: "PS1 Responses", path: "/ps/cutoffs/ps1" },
        { name: "PS2 Responses", path: "/ps/cutoffs/ps2" },
        { name: "PS Chronicles", path: "/ps/chronicles" },
        { name: "PS1 Reviews", path: "/ps/reviews/ps1" },
        { name: "PS2 Reviews", path: "/ps/reviews/ps2" },
      ]
    },
    {
      title: "Others.",
      description: "Everything else",
      items: [
        { name: "Rants", path: "/rants" },
        { name: "Professor Chambers", path: "/chambers" }
      ]
    }
  ];

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

      <div className="py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">Handouts4U.</h1>
            <p className="text-md md:text-xl text-white mb-6">Your complete resource hub for BITS Pilani Hyderabad Campus</p>

            {/* Main Buttons */}
            <div className="grid md:grid-cols-3 justify-around" >
              <>
                <Link className="m-3" href="https://github.com/thenicekat/handoutsforyou">
                  <button className="btn btn-success w-full" tabIndex={-1}>
                    ⭐️ Star on Github ({starCount})
                  </button>
                </Link>

                <Link className="m-3" href="/donations">
                  <button className="btn btn-warning w-full" tabIndex={-1}>
                    💸 Fund the Project!
                  </button>
                </Link>

                {
                  !session ?
                    <Link className="m-3" href={"#"}>
                      <button className="btn btn-warning btn-outline w-full" onClick={() => signIn("google")} tabIndex={-1}>Sign In</button>
                    </Link>
                    :
                    <Link className="m-3" href={"#"}>
                      <button className="btn btn-error w-full" onClick={() => signOut()} tabIndex={-1}>Sign Out</button>
                    </Link>
                }
              </>

            </div >
          </div>
          <div className="md:w-1/2 justify-center hidden md:flex">
            <Image src="/logo.svg" width={300} height={300} alt="H4U logo" className="drop-shadow-md" />
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="grid place-items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-xl mt-4">Loading resources...</p>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && (
        <div className="container mx-auto px-4 py-8">
          {/* Resource Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {navigationCategories.map((category, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{category.title}</h2>
                  <p className="text-gray-600 mb-6">{category.description}</p>
                  <div className="space-y-3">
                    {category.items.map((item, i) => (
                      <Link href={item.path} key={i}>
                        <div className="flex items-center justify-between p-3 m-1 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <span className="font-medium text-gray-800">{item.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Statistics Section */}
          {session && (
            <div className="mt-16 p-8 rounded-lg shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-center mb-8">Statistics.</h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <span className="text-4xl text-primary font-bold block">
                    <CountUp end={3200} duration={3} />
                  </span>
                  <div className="text-lg mt-2">Handouts</div>
                </div>
                <div className="text-center">
                  <span className="text-4xl text-primary font-bold block">
                    <CountUp end={summaryData.reviews} duration={3} />
                  </span>
                  <div className="text-lg mt-2">Course Reviews</div>
                </div>
                <div className="text-center">
                  <span className="text-4xl text-primary font-bold block">
                    <CountUp end={summaryData.resources} duration={3} />
                  </span>
                  <div className="text-lg mt-2">Resources</div>
                </div>
                <div className="text-center">
                  <span className="text-4xl text-primary font-bold block">
                    <CountUp end={summaryData.grading} duration={3} />
                  </span>
                  <div className="text-lg mt-2">Grading</div>
                </div>
                <div className="text-center">
                  <span className="text-4xl text-primary font-bold block">
                    <CountUp end={summaryData.placement_ctcs} duration={3} />
                  </span>
                  <div className="text-lg mt-2">Placement CTCs</div>
                </div>
                <div className="text-center">
                  <span className="text-4xl text-primary font-bold block">
                    <CountUp end={summaryData.si_data} duration={3} />
                  </span>
                  <div className="text-lg mt-2">SI Data</div>
                </div>
                <div className="text-center">
                  <span className="text-4xl text-primary font-bold block">
                    <CountUp end={summaryData.ps1} duration={3} />
                  </span>
                  <div className="text-lg mt-2">PS1 Responses</div>
                </div>
                <div className="text-center">
                  <span className="text-4xl text-primary font-bold block">
                    <CountUp end={summaryData.ps2} duration={3} />
                  </span>
                  <div className="text-lg mt-2">PS2 Responses</div>
                </div>
              </div>

              <div className="text-center mt-8">
                <p className="text-lg font-medium mb-4">Thank you for making this project a huge success! 🤍</p>
                <p className="text-sm text-white">
                  Vashisth Choudhari, Anagha G, Ruban SriramBabu, Nishith Kumar, Srikant Tangirala, Mahith Tunuguntla,
                  Anubhab Khanra, Adarsh Das, Manan Gupta, Aman Ranjan, Soham Barui, Aarsh Kulkarni, Manish Vasireddy,
                  Sai Charan, Santrupti Behera, Varad Gorantyal, Sudhanshu Patil, Aditya Kumar, Harshit Juneja,
                  Anirudh Agarwal, Ashna, Shubham Agrawal, Shubh Badjate, Areen Raj, Dev Gala, Dhairya Agarwal,
                  Jason Aaron Goveas, Shivam Atul Trivedi, Nirmal Sethumadhavan, Pratyush Nair, Aryan Dalmia,
                  Umaang Khambhati and everyone else...
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
