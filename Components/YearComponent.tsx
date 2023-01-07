import Link from "next/link";

type Props = {
    handouts: any;
    year: any;
    searchWord: string;
}

export default function YearComponent({ handouts, year, searchWord }: Props) {
  return (
    <div className="border-solid border-2 border-green-600">
        {
            handouts.filter((handout: any) => handout.toLowerCase().includes(searchWord.toLowerCase())).map((handout: any) => (
                <div key={handout} className='py-6'>
                  <div className="alert shadow-lg">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span>{handout}</span>
                    </div>
                    <div className="flex-none">
                      <button className="btn btn-sm btn-ghost" disabled>{'Year ' + year.split("_")[0] + '-' + year.split("_")[1]}</button>
                      <Link href={"/handouts/" + year + '/' + handout}><button className="btn btn-sm btn-primary">View</button></Link>
                    </div>
                  </div>
                </div>
            ))
        }
    </div>
  )
}