import { FormField, TextInput, SelectInput, Checkbox } from '@/components/FormField'
import { ps1Years, ps2Semesters, psAllotmentRounds } from '@/config/years_sems'

interface PSCutoffFormProps {
    isPS1: boolean
    idNumber: string
    setIdNumber: (value: string) => void
    yearAndSem: string
    setYearAndSem: (value: string) => void
    station: string
    setStation: (value: string) => void
    cgpa: string
    setCgpa: (value: string) => void
    preference: string
    setPreference: (value: string) => void
    allotmentRound: string
    setAllotmentRound: (value: string) => void
    stipend?: string
    setStipend?: (value: string) => void
    offshoot?: string
    setOffshoot?: (value: string) => void
    offshootTotal?: string
    setOffshootTotal?: (value: string) => void
    offshootType?: string
    setOffshootType?: (value: string) => void
    isPublic: boolean
    setIsPublic: (value: boolean) => void
}

export default function PSCutoffForm({
    isPS1,
    idNumber,
    setIdNumber,
    yearAndSem,
    setYearAndSem,
    station,
    setStation,
    cgpa,
    setCgpa,
    preference,
    setPreference,
    allotmentRound,
    setAllotmentRound,
    stipend,
    setStipend,
    offshoot,
    setOffshoot,
    offshootTotal,
    setOffshootTotal,
    offshootType,
    setOffshootType,
    isPublic,
    setIsPublic
}: PSCutoffFormProps) {
    const yearOptions = isPS1 
        ? ps1Years.map(year => ({ value: year, label: year }))
        : ps2Semesters.map(sem => ({ value: sem, label: sem }))

    const roundOptions = psAllotmentRounds.map(round => ({ value: round, label: round }))

    return (
        <>
            <FormField label="ID Number" required>
                <TextInput
                    value={idNumber}
                    onChange={setIdNumber}
                    placeholder="Enter your 13-digit ID number"
                    maxLength={13}
                />
            </FormField>

            <FormField label={isPS1 ? "Batch" : "Year and Semester"} required>
                <SelectInput
                    value={yearAndSem}
                    onChange={setYearAndSem}
                    options={yearOptions}
                    placeholder={isPS1 ? "Select Batch" : "Select Year and Semester"}
                />
            </FormField>

            <FormField label="Station" required>
                <TextInput
                    value={station}
                    onChange={setStation}
                    placeholder="Enter station name"
                />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField label="CGPA" required className="">
                    <TextInput
                        type="number"
                        value={cgpa}
                        onChange={setCgpa}
                        placeholder="0.00"
                        min="0"
                        max="10"
                        step="0.01"
                    />
                </FormField>

                <FormField label="Preference" required className="">
                    <TextInput
                        type="number"
                        value={preference}
                        onChange={setPreference}
                        placeholder="1"
                        min="1"
                    />
                </FormField>
            </div>

            <FormField label="Allotment Round" required>
                <SelectInput
                    value={allotmentRound}
                    onChange={setAllotmentRound}
                    options={roundOptions}
                    placeholder="Select Round"
                />
            </FormField>

            {!isPS1 && stipend !== undefined && setStipend && (
                <>
                    <FormField label="Stipend (₹)" required>
                        <TextInput
                            type="number"
                            value={stipend}
                            onChange={setStipend}
                            placeholder="Enter stipend amount"
                            min="0"
                            max="1200000"
                        />
                    </FormField>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <FormField label="Offshoot" required className="">
                            <TextInput
                                type="number"
                                value={offshoot || ''}
                                onChange={setOffshoot || (() => {})}
                                placeholder="0"
                                min="0"
                            />
                        </FormField>

                        <FormField label="Offshoot Total" required className="">
                            <TextInput
                                type="number"
                                value={offshootTotal || ''}
                                onChange={setOffshootTotal || (() => {})}
                                placeholder="0"
                                min="0"
                            />
                        </FormField>

                        <FormField label="Offshoot Type" required className="">
                            <TextInput
                                value={offshootType || ''}
                                onChange={setOffshootType || (() => {})}
                                placeholder="Type"
                            />
                        </FormField>
                    </div>
                </>
            )}

            <FormField label="" className="mb-4">
                <Checkbox
                    checked={isPublic}
                    onChange={setIsPublic}
                    label="Make this data public (helps other students)"
                />
            </FormField>
        </>
    )
}
