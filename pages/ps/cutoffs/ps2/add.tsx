import Head from "next/head";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Menu from "@/components/Menu";
import { toast } from "react-toastify";
import CustomToastContainer from "@/components/ToastContainer";
import AutoCompleter from "@/components/AutoCompleter";
import { semesters, allotmentRounds } from "@/data/years_sems";
import { useRouter } from "next/router";

export default function AddPS2Response({ }: {}) {
    const router = useRouter();
    const { edit } = router.query;
    const isEditMode = edit === "true";

    const [idNumber, setIdNumber] = useState("");
    const [yearAndSem, setYearAndSem] = useState("");
    const [allotmentRound, setAllotmentRound] = useState("");
    const [station, setStation] = useState("");
    const [stipend, setStipend] = useState(0);
    const [cgpa, setCGPA] = useState(0);
    const [preference, setPreference] = useState(1);
    const [offshoot, setOffshoot] = useState(0);
    const [offshootTotal, setOffshootTotal] = useState(0);
    const [offshootType, setOffshootType] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [responseId, setResponseId] = useState<number | null>(null);

    const [userResponses, setUserResponses] = useState<any[]>([]);
    const [selectedResponse, setSelectedResponse] = useState<string>("");

    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingResponses, setIsFetchingResponses] = useState(false);

    const { session } = useAuth();

    useEffect(() => {
        if (isEditMode && session) {
            fetchUserResponses();
        }
    }, [isEditMode, session]);

    useEffect(() => {
        if (selectedResponse) {
            const response = userResponses.find(r => r.id.toString() === selectedResponse);
            if (response) {
                setIdNumber(response.id_number || "");
                setYearAndSem(response.year_and_sem || "");
                setAllotmentRound(response.allotment_round || "");
                setStation(response.station || "");
                setStipend(response.stipend || 0);
                setCGPA(response.cgpa || 0);
                setPreference(response.preference || 1);
                setOffshoot(response.offshoot || 0);
                setOffshootTotal(response.offshoot_total || 0);
                setOffshootType(response.offshoot_type || "");
                setIsPublic(response.public === true);
                setResponseId(response.id);
            }
        } else {
            setIdNumber("");
            setYearAndSem("");
            setAllotmentRound("");
            setStation("");
            setStipend(0);
            setCGPA(0);
            setPreference(1);
            setOffshoot(0);
            setOffshootTotal(0);
            setOffshootType("");
            setIsPublic(true);
            setResponseId(null);
        }
    }, [selectedResponse]);

    const fetchUserResponses = async () => {
        setIsFetchingResponses(true);
        try {
            const response = await fetch("/api/ps/cutoffs/get", {
                method: "POST",
                body: JSON.stringify({ type: "ps2" }),
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
        setIsLoading(true)

        if (semesters.indexOf(yearAndSem) === -1) {
            toast.error("Invalid Year and Sem, Please select from the dropdown!")
            setIsLoading(false)
            return
        }

        if (allotmentRounds.indexOf(allotmentRound) === -1) {
            toast.error("Invalid Allotment Round, Please select from the dropdown!")
            setIsLoading(false)
            return
        }

        if (!stipend || !cgpa || !preference) {
            toast.error("Missing one of the fields: stipend, cgpa or preference!")
            setIsLoading(false)
            return
        }

        if (offshoot > offshootTotal) {
            toast.error("Offshoot cannot be greater than Offshoot Total!")
            setIsLoading(false)
            return
        }

        const endpoint = isEditMode ? "/api/ps/cutoffs/edit" : "/api/ps/cutoffs/add";
        const payload = {
            typeOfPS: "ps2",
            idNumber: idNumber,
            yearAndSem: yearAndSem,
            allotmentRound: allotmentRound,
            station: station,
            stipend: stipend,
            cgpa: cgpa,
            preference: preference,
            offshoot: offshoot,
            offshootTotal: offshootTotal,
            offshootType: offshootType,
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
            setStipend(0);
            setCGPA(0);
            setPreference(0);
            setOffshoot(0);
            setOffshootTotal(0);
            setOffshootType("");
            setResponseId(null);
            setSelectedResponse("");

            window.location.href = "/ps/cutoffs/ps2/";
        }
        setIsLoading(false);
    }

    return (
        <>
            <Head>
                <title>{isEditMode ? "Edit PS2 Response" : "Add PS2 Response"}</title>
                <meta name="description" content="One stop place for your PS queries, handouts, and much more" />
                <meta name="keywords" content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics, practice school, ps, queries, ps cutoffs, ps2, ps1" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        {isEditMode ? "Edit PS2 Response" : "Add PS2 Response"}
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
                                                    {response.station} - {response.year_and_sem} - {response.allotment_round}
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
                                <input type="text" id="idNumber" className="input input-secondary" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} disabled={isEditMode} />
                            </div>

                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="yearAndSem" className="text-primary">Year and Sem</label>
                                {isEditMode ? (
                                    <input
                                        type="text"
                                        className="input input-secondary w-full"
                                        value={yearAndSem}
                                        disabled={true}
                                    />
                                ) : (
                                    <AutoCompleter
                                        name="Year and Sem"
                                        value={yearAndSem}
                                        items={semesters}
                                        onChange={(e) => setYearAndSem(e)}
                                    />
                                )}
                            </div>

                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="allotmentRound" className="text-primary">Allotment Round</label>
                                <AutoCompleter name="allotment round" items={allotmentRounds} value={allotmentRound} onChange={(val) => setAllotmentRound(val)} />
                            </div>

                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="station" className="text-primary">Station (Please mention the role as well.)</label>
                                <input type="text" id="station" className="input input-secondary" value={station} onChange={(e) => setStation(e.target.value)} />
                            </div>

                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="stipend" className="text-primary">Stipend</label>
                                <input type="number" id="stipend" className="input input-secondary" value={stipend} onChange={(e) => setStipend(parseFloat(e.target.value))} />
                            </div>

                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="cgpa" className="text-primary">CGPA</label>
                                <input type="number" id="cgpa" className="input input-secondary" value={cgpa} onChange={(e) => setCGPA(parseFloat(e.target.value))} />
                            </div>

                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="preference" className="text-primary">Preference</label>
                                <input type="number" id="preference" className="input input-secondary" value={preference} onChange={(e) => setPreference(parseFloat(e.target.value))} />
                            </div>

                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="offshoot" className="text-primary">Offshoot (Ignore if not relevant)</label>
                                <input type="number" id="offshoot" className="input input-secondary" value={offshoot} onChange={(e) => setOffshoot(parseFloat(e.target.value) || 0)} />
                            </div>

                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="offshootTotal" className="text-primary">Offshoot Total (Ignore if not relevant)</label>
                                <input type="number" id="offshootTotal" className="input input-secondary" value={offshootTotal} onChange={(e) => setOffshootTotal(parseFloat(e.target.value) || 0)} />
                            </div>

                            <div className="flex flex-col w-3/4 justify-between m-1">
                                <label htmlFor="offshootType" className="text-primary">Offshoot Type (Ignore if not relevant)</label>
                                <input type="text" id="offshootType" className="input input-secondary" value={offshootType} onChange={(e) => setOffshootType(e.target.value)} />
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
            <CustomToastContainer containerId="addPS2Response" />
        </>
    )
}