import { useState } from "react";
import Link from "next/link";
import MinorComponent from "../Components/MinorComponent";

const minors = [
    {
        title: "Minor in Aeronautics",
        desc: `Aeronautics is an exhilarating field encompassing the fundamentals of aerodynamics
        (interaction of air with objects in motion), propulsion (power systems responsible for the
        generation of thrust for providing motion), structures (design of airframes and material
        characteristics), and flight mechanics (trajectory study and optimization), as applied to airborne vehicles within the Earth’s atmosphere, and to rockets and spacecrafts outside.
        `,
        coursesRegd: 6,
        unitsReqd: 18,
        coreCourses: ['AN F311 Principles of Aerodynamics', 'AN F312 Aircraft Propulsion', 'AN F313 Flight Mechanics and Controls'],
        electives: ['AN F314 Introduction to Flight', 'AN F315 Aircraft Structures', 'ME F415 Gas Dynamics', 'ME F418 Rocket and Spacecraft Propulsion', 'ME F452 Composite Materials and Design', 'ME F482 Combustion', 'ME F485 Numerical Techniques for Fluid Flow & Heat Transfer', 'EEE F242 Control Systems', 'EEE F417 Computer Based Control Systems', 'ME F376 Design Project']
    }
]

function Minors() {

    return (
        <>
            {/* Search box */}
            <div className='grid h-96 place-items-center'>
                <div className='w-[50vw] place-items-center flex flex-col justify-between'>
                    <h1 className='text-5xl py-5'>Minors.</h1>
                    
                </div>
            </div>

            <div className='px-2 md:px-20'>
                {
                    minors.map(minor => (
                        <MinorComponent minor={minor} />
                    ))
                }
            </div>
        </>
    )
}

export default Minors