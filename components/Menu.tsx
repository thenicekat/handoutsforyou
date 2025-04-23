import React from 'react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { ArrowsPointingInIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/solid';
import StarPrompt from './StarPrompt';

const Menu = () => {
    const { data: session } = useSession();
    const [starCount, setStarCount] = React.useState(0);
    const [mobileMenu, setMobileMenu] = React.useState(false);

    const menuItems: Record<string, string> = {
        "Handouts": "/handouts",
        "Course Prereqs": "/courses/prereqs",
        "Course PYQs": "/courses/pyqs",
        "Course Resources": "/courses/resources",
        "Course Reviews": "/courses/reviews",
        "Course Grading": "/courses/grading",
        "Professor Chambers": "/chambers",
        "SI Resources": "/si",
        "SI Companies": "/si/companies",
        "Rants": "/rants",
        "Placement Resources": "/placements",
        "Placement CTCs": "/placements/ctcs",
        "Practice School": "/ps/",
        "PS Chronicles": "/ps/chronicles",
        "Research Chronicles": "https://pollen-box-786.notion.site/Research-Chronicles-894bcac1266d4e5fac2f4cd76ff29750",
        "Higher Studies": "/higherstudies/resources",
    };

    const toggleMobileMenu = () => setMobileMenu(!mobileMenu);

    return (
        <>
            <StarPrompt setStarCount={setStarCount} />

            {/* Mobile Menu Toggle */}
            <div
                className={`fixed bottom-12 md:top-5 right-5 z-50 cursor-pointer p-3 rounded-full transform transition-transform`}
                onClick={toggleMobileMenu}
            >
                {!mobileMenu ? (
                    <ArrowsPointingOutIcon className="h-8 w-8 text-white" />
                ) : (
                    <ArrowsPointingInIcon className="h-8 w-8 text-white" />
                )}
            </div>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-80 backdrop-blur-md z-40 transform ${mobileMenu ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out`}
            >
                <div className="flex flex-col items-center justify-center h-full text-white space-y-6">
                    <h1 className="text-4xl font-extrabold">Sitemap.</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-3/4">
                        {Object.keys(menuItems).map((menuItem) => (
                            <Link
                                key={menuItems[menuItem]}
                                href={menuItems[menuItem]}
                                className="text-xl font-medium hover:underline hover:text-teal-400 transition duration-200"
                            >
                                {menuItem}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

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
        </>
    );
};

export default Menu;
