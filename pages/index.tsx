import Head from "next/head";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import CountUp from 'react-countup';
import Image from 'next/image';
import { toast } from 'react-toastify';
import Link from 'next/link';
import StarPrompt from "@/components/StarPrompt";
import Menu from "@/components/Menu";

type SummaryData = {
  handouts: number,
  ps1Cutoffs: number,
  ps2Cutoffs: number,
  courseReviews: number,
  courseResources: number,
  courseGrading: number
  coursePrerequisites: number,
  coursePyqs: number,
  placementCtcs: number,
  placementResources: number,
  siCompanies: number,
  siChronicles: number,
  siResources: number,
  higherStudiesResources: number,
}

export default function Home() {
  const { session } = useAuth()
  const [isLoading, setIsLoading] = useState(false);
  const [starCount, setStarCount] = useState(0);
  const [summaryData, setSummaryData] = useState<SummaryData>({
    handouts: 3200,
    ps1Cutoffs: 0,
    ps2Cutoffs: 0,
    courseReviews: 0,
    courseGrading: 0,
    courseResources: 0,
    coursePrerequisites: 707,
    coursePyqs: 80,
    placementCtcs: 0,
    placementResources: 30,
    siCompanies: 0,
    siChronicles: 0,
    siResources: 10,
    higherStudiesResources: 0,
  });

  const fetchSummaryData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/summary/data');
      
      // If we get a 400 (unauthorized) or any other error, just use default values
      if (!response.ok) {
        console.log(`Using default values due to ${response.status} response`);
        return;
      }

      // Only try to parse JSON if the response was successful
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const res = await response.json();
        if (res.error) {
          console.log('API returned error:', res.message);
          return;
        }
        setSummaryData(prev => ({
          ...prev,
          ps1Cutoffs: res.data.ps1Cutoffs || 0,
          ps2Cutoffs: res.data.ps2Cutoffs || 0,
          courseReviews: res.data.courseReviews || 0,
          courseResources: res.data.courseResources || 0,
          placementCtcs: res.data.placementCtcs || 0,
          siCompanies: res.data.siCompanies || 0,
          siChronicles: res.data.siChronicles || 0,
          courseGrading: res.data.courseGrading || 0,
          higherStudiesResources: res.data.higherStudiesResources || 0,
        }));
      }
    } catch (error) {
      console.log('Error fetching summary data:', error);
      // On error, we'll just keep using the default values
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { fetchSummaryData() }, []);

  const navigationCategories = [
    {
      title: "Academic Resources.",
      description: "Access course materials, handouts, and academic resources",
      items: [
        { name: "Handouts", path: "/handouts", count: summaryData.handouts },
        { name: "Prerequisites", path: "/courses/prereqs", count: summaryData.coursePrerequisites },
        { name: "Previous Year Questions", path: "/courses/pyqs", count: summaryData.coursePyqs },
        { name: "Reviews", path: "/courses/reviews", count: summaryData.courseReviews },
        { name: "Resources", path: "/courses/resources", count: summaryData.courseResources },
        { name: "Grading", path: "/courses/grading", count: summaryData.courseGrading },
      ]
    },
    {
      title: "Future Resources.",
      description: "Explore placement information and other opportunities",
      items: [
        { name: "Placement CTCs", path: "/placements/ctcs", count: summaryData.placementCtcs },
        { name: "Placement Resources", path: "/placements/resources", count: summaryData.placementResources },
        { name: "SI Resources", path: "/si/resources", count: summaryData.siResources },
        { name: "SI Companies", path: "/si/companies", count: summaryData.siCompanies + summaryData.siChronicles },
        { name: "Research Chronicles", path: "https://pollen-box-786.notion.site/Research-Chronicles-894bcac1266d4e5fac2f4cd76ff29750" },
        { name: "Higher Studies", path: "/higherstudies/resources", count: summaryData.higherStudiesResources },
      ]
    },
    {
      title: "Practice School.",
      description: "Find information about PS stations and experiences",
      items: [
        { name: "PS1 Responses", path: "/ps/cutoffs/ps1", count: summaryData.ps1Cutoffs },
        { name: "PS2 Responses", path: "/ps/cutoffs/ps2", count: summaryData.ps2Cutoffs },
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

      <Menu doNotShowMenu={true} />
      <StarPrompt setStarCount={setStarCount} />

      <div className="py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Handouts4U.</h1>
          <p className="text-md md:text-lg text-white mb-6 text-center">
            Your complete resource hub.
            <br />
            Thank you for making this project a huge success! 🤍
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="grid place-items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-lg mt-4">Loading resources...</p>
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
                          {item.count && item.count > 0 && (
                            <span className="text-primary font-bold text-sm bg-black px-2 py-1 rounded-full">
                              <CountUp end={item.count} duration={5} />
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-lg font-medium mb-4"></p>
            <p className="text-sm text-white">
              Vashisth Choudhari, Pratyush Nair, Anagha G, Adarsh Das, Santrupti Behera, Ruban SriramBabu, Nishith Kumar, Srikant Tangirala, Mahith Tunuguntla, Anubhab Khanra, Manan Gupta, Aman Ranjan, Soham Barui, Aarsh Kulkarni, Manish Vasireddy, Sai Charan,  Varad Gorantyal, Sudhanshu Patil, Aditya Kumar, Harshit Juneja, Anirudh Agarwal, Ashna, Shubham Agrawal, Shubh Badjate, Areen Raj, Dev Gala, Dhairya Agarwal, Jason Aaron Goveas, Shivam Atul Trivedi, Nirmal Sethumadhavan, Aryan Dalmia, Umaang Khambhati and everyone else...
            </p>
          </div>

        </div >
      )
      }
    </>
  );
}
