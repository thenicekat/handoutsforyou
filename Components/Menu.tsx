import React, { useRef } from 'react'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import Footer from './Footer'
import AutoCompleter from './AutoCompleter'
import classNames from 'classnames'

type Props = {
    current: String
}

const Menu = (props: Props) => {
    const { data: session } = useSession()
    const [open, setOpen] = React.useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const menuItems: any = {
        "Handouts": "/",
        "Notes and Resources": "/notes",
        "Course Reviews": "/courses/reviews",
        "Summer Internships": "/si",
        "Add your Content": "https://forms.gle/5Q2Ek3TNGmAx2Rn46",
        "Practice School": "/ps",
        "Course Prereqs": "/courses/prereqs",
        "Info. about Minors": "/minors.html"
    }


    return (
        <>
            <div
                // use classnames here to easily toggle dropdown open 
                className={classNames({
                    "dropdown w-1/2": true,
                    "dropdown-open": open,
                })}
                ref={ref}
            >
                <input
                    type="text"
                    className="input input-secondary w-full"
                    placeholder={`Where do you want to go?`}
                    tabIndex={0}
                />

                {/* add this part */}
                <div className="dropdown-content bg-base-200 z-50 top-14 max-h-96 overflow-auto flex-col rounded-md">
                    <ul
                        className="menu menu-compact "
                        // use ref to calculate the width of parent
                        style={{ width: ref.current?.clientWidth }}
                    >
                        {Object.keys(menuItems)
                            .filter((item) => item.toLowerCase())
                            .map((item, index) => {
                                return (
                                    <li
                                        key={index}
                                        tabIndex={index + 1}
                                        onClick={() => {
                                            window.open(menuItems[item])
                                        }}
                                        className="border-b border-b-base-content/10 w-full"
                                    >
                                        <button className="uppercase">{item}</button>
                                    </li>
                                );
                            })}
                    </ul>
                    {/* add this part */}
                </div>
            </div>

            {/* <div className={`${menu ? 'grid' : 'hidden'} md:grid md:grid-cols-4 justify-around`}>
                {Object.keys(menuItems).map(
                    (menuItem) =>
                        <Link className="m-3" href={menuItems[menuItem]} target='_blank'>
                            <button className="btn btn-outline w-full">
                                {menuItem}
                            </button>
                        </Link>
                )}
            </div> */}

            < div className="grid md:grid-cols-3 justify-around" >
                {
                    !session
                        ?
                        <div className='col-span-3'>
                            <button className="btn btn-outline m-3" onClick={() => signIn("google")}>Sign in to access</button>
                        </div>
                        :
                        <Link href={"#"} className={`m-3 col-span-3`}>
                            <button className="btn btn-outline w-full" onClick={() => signOut()}>Sign Out</button>

                        </Link>
                }
            </div >
        </>)
}

export default Menu;