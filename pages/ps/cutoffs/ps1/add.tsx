import Head from "next/head";
import { useState, useEffect } from "react";
import Menu from "@/components/Menu";
import { useAuth } from "@/hooks/useAuth";
import { years, allotmentRounds } from "@/data/years_sems";
import AutoCompleter from "@/components/AutoCompleter";
import { toast } from "react-toastify";
import CustomToastContainer from "@/components/ToastContainer";
import { useRouter } from "next/router";

export default function AddPS1Response({ }: {}) {
    const router = useRouter();
    const { edit } = router.query;
    const isEditMode = edit === "true";

    const [idNumber, setIdNumber] = useState("");
    const [yearAndSem, setYearAndSem] = useState("");
    const [allotmentRound, setAllotmentRound] = useState("");
    const [station, setStation] = useState("");
    const [cgpa, setCGPA] = useState(0);
    const [preference, setPreference] = useState(1);
    const [isPublic, setIsPublic] = useState(true);
    const [responseId, setResponseId] = useState<number | null>(null);

    const [userResponses, setUserResponses] = useState<any[]>([]);
    const [selectedResponse, setSelectedResponse] = useState<string>("");

    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingResponses, setIsFetchingResponses] = useState(false);

    const { session } = useAuth();

    // Fetch user responses if in edit mode
    useEffect(() => {
        if (isEditMode && session) {
            fetchUserResponses();
        }
    }, [isEditMode, session]);

    // Populate form when a response is selected
    useEffect(() => {
        if (selectedResponse) {
            const response = userResponses.find(r => r.id.toString() === selectedResponse);
            if (response) {
                setIdNumber(response.id_number || "");
                setYearAndSem(response.year_and_sem || "");
                setAllotmentRound(response.allotment_round || "");
                setStation(response.station || "");
                setCGPA(response.cgpa || 0);
                setPreference(response.preference || 1);
                setIsPublic(response.public === 1);
                setResponseId(response.id);
            }
        }
    }, [selectedResponse]);

    const fetchUserResponses = async () => {
        setIsFetchingResponses(true);
        try {
            const response = await fetch("/api/ps/cutoffs/get", {
                method: "POST",
                body: JSON.stringify({ type: "ps1" }),
                headers: { "Content-Type": "application/json" }
            });
            
            if (response.ok) {
                const data = await response.json()
                if (!data.error) {
                    setUserResponses(data.data)
                } else {
                    toast.error(data.message)
                }
            } else {
                toast.error("Failed to fetch your responses")
            }
        } catch (error) {
            toast.error("An error occurred while fetching your responses")
        } finally {
            setIsFetchingResponses(false);
        }
    };

    const AddResponse = async () => {
        setIsLoading(true);

        if (years.indexOf(yearAndSem) === -1) {
            toast.error("Invalid Year, Please select from the dropdown!")
            setIsLoading(false);
            return;
        }

        if (allotmentRounds.indexOf(allotmentRound) === -1) {
            toast.error("Invalid Allotment Round, Please select from the dropdown!")
            setIsLoading(false);
            return;
        }

        if (!cgpa || !preference) {
            toast.error("Missing one of the fields: cgpa or preference!")
            setIsLoading(false);
            return;
        }

        const endpoint = isEditMode ? "/api/ps/cutoffs/edit" : "/api/ps/cutoffs/add";
        const payload = {
            typeOfPS: "ps1",
            idNumber: idNumber,
            yearAndSem: yearAndSem,
            allotmentRound: allotmentRound,
            station: station,
            cgpa: cgpa,
            preference: preference,
            public: isPublic ? 1 : 0,
            ...(isEditMode && responseId && { id: responseId })
        };

        const res = await fetch(endpoint, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" }
        });
        
        const data = await res.json();
        if (data.error) {
            toast.error(data.message);
        } else {
            toast.success(isEditMode 
                ? "Your response was updated successfully!" 
                : "Thank you! Your response was added successfully!")
                
            setIdNumber("");
            setYearAndSem("");
            setAllotmentRound("");
            setStation("");
            setCGPA(0);
            setPreference(0);
            setResponseId(null);
            setSelectedResponse("");

            window.location.href = "/ps/cutoffs/ps1/";
        }
        setIsLoading(false);
    };

    return (
        <>
            <Head>
                <title>{isEditMode ? "Edit PS1 Response" : "Add PS1 Response"}</title>
                <meta name="description" content="One stop place for your PS queries, handouts, and much more" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics, practice school, ps, queries, ps cutoffs, PS1, ps1" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        {isEditMode ? "Edit PS1 Response" : "Add PS1 Response"}
                    </h1>

                    <Menu />

                    {session &&
                        isLoading ? (
                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label className="text-primary">Loading...</label>
                            </div>
                        ) : (
                            <>
                                {isEditMode && (
                                    <div className="flex flex-col w-3/4 justify-between m-1">
                                        <label htmlFor="responseSelect" className="text-primary">Select Response to Edit</label>
                                        {isFetchingResponses ? (
                                            <p>Loading your responses...</p>
                                        ) : userResponses.length > 0 ? (
                                            <select 
                                                id="responseSelect" 
                                                className="select select-secondary" 
                                                value={selectedResponse}
                                                onChange={(e) => setSelectedResponse(e.target.value)}
                                            >
                                                <option value="">Select a response</option>
                                                {userResponses.map(response => (
                                                    <option key={response.id} value={response.id}>
                                                        {response.station} - {response.year_and_sem} - Round {response.allotment_round}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <p>You don't have any responses to edit.</p>
                                        )}
                                    </div>
                                )}

                                <div className="flex flex-col w-3/4 justify-between m-1">
                                    <label htmlFor="idNumber" className="text-primary">ID Number</label>
                                    <input 
                                        type="text" 
                                        id="idNumber" 
                                        className="input input-secondary" 
                                        value={idNumber} 
                                        onChange={(e) => setIdNumber(e.target.value)} 
                                    />
                                </div>

                                <div className="flex flex-col w-3/4 justify-between m-1">
                                    <label htmlFor="yearAndSem" className="text-primary">Year and Sem</label>
                                    <AutoCompleter 
                                        name="Year and Sem" 
                                        value={yearAndSem} 
                                        items={years} 
                                        onChange={(e) => setYearAndSem(e)} 
                                    />
                                </div>

                                <div className="flex flex-col w-3/4 justify-between m-1">
                                    <label htmlFor="allotmentRound" className="text-primary">Allotment Round</label>
                                    <AutoCompleter 
                                        name="allotment round" 
                                        items={allotmentRounds} 
                                        value={allotmentRound} 
                                        onChange={(val) => setAllotmentRound(val)} 
                                    />
                                </div>

                                <div className="flex flex-col w-3/4 justify-between m-1">
                                    <label htmlFor="station" className="text-primary">Station (Please mention the role as well.)</label>
                                    <input 
                                        type="text" 
                                        id="station" 
                                        className="input input-secondary" 
                                        value={station} 
                                        onChange={(e) => setStation(e.target.value)} 
                                    />
                                </div>

                                <div className="flex flex-col w-3/4 justify-between m-1">
                                    <label htmlFor="cgpa" className="text-primary">CGPA</label>
                                    <input 
                                        type="number" 
                                        id="cgpa" 
                                        className="input input-secondary" 
                                        value={cgpa} 
                                        onChange={(e) => setCGPA(parseFloat(e.target.value))} 
                                    />
                                </div>

                                <div className="flex flex-col w-3/4 justify-between m-1">
                                    <label htmlFor="preference" className="text-primary">Preference</label>
                                    <input 
                                        type="number" 
                                        id="preference" 
                                        className="input input-secondary" 
                                        value={preference} 
                                        onChange={(e) => setPreference(parseFloat(e.target.value))} 
                                    />
                                </div>

                                <div className="text-center flex-wrap w-3/4 justify-between m-1">
                                    <label className="text-primary">DO YOU WANT TO MAKE YOUR ID NUMBER PUBLIC? </label>
                                    <input
                                        type="checkbox"
                                        onChange={(e) => setIsPublic(e.target.checked)}
                                        checked={isPublic}
                                    />
                                    <br />
                                </div>

                                <div className="text-center flex-wrap w-3/4 justify-between m-1">
                                    <button 
                                        className="btn btn-primary" 
                                        onClick={AddResponse}
                                        disabled={isEditMode && !selectedResponse}
                                    >
                                        {isEditMode ? "Update Response" : "Add Response"}
                                    </button>
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
            <CustomToastContainer containerId="addPS1Response" />
        </>
    )
}