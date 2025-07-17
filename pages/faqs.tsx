import { getMetaConfig } from '@/utils/meta-config';
import Meta from '@/components/Meta';
import { useState } from 'react'
import Menu from '@/components/Menu'
import { FaqModel } from '@/types/FaqModel'

export default function Faqs() {
    const [input, setInput] = useState('')

    const faqs: FaqModel[] = [
        {
            question: 'What is cms?',
            answer: "Course management system. It's used mainly for course announcements, sharing marks lists, and stuff.",
        },
        {
            question: 'What is SWD ?',
            answer: 'Student welfare division.All the non - academic things related to students come under this.The app is used for important documents as well as for mess registration.',
        },
        {
            question: 'How do you get professor’s emails ?',
            answer: 'You can just use the email compose feature and find out anybody’s email address in the same university, as in BITS',
        },
        {
            question: 'How do we download books ?',
            answer: "There should be some drive links.There's even a drive link with all my notes in it.",
        },
        {
            question: 'Where to find recorded lectures ?',
            answer: 'Google meet recordings are usually shared in one of 3 ways: the links of each individual class is shared to students via mail or cms, etc., or a drive link is made with all the students of the course, and all the lectures are added there.The last method is through google calendar',
        },
        {
            question: "Where to find previous year's question papers",
            answer: "Hi, since people are asking for previous years' papers. There is a way that you might be able to get some (not all). There is a thing called cms scraper, it's essentially a drive with all previous sems cms contents(started recently so you won't get anything older than second sem 18-19). https://drive.google.com/drive/u/1/folders/1IK4BPRF1wuDQgWtEJ49XJlGqzXbq0cIV?fbclid=IwAR1tEAn0zpMkPE-D1PbxwIdUM3-Pc6_u_1GjWGGWWeOHZzlsRXuhVkpkpCg Here is the link.Navigation is kind of self - explanatory, if the IC of that particular year uploaded the solutions in cms then it'll be there.",
        },
        {
            question:
                'How do academics work here ? A LITTLE BRIEF ON LECTURE, LABORATORY, AND TUTORIAL WORKING SYSTEM.',
            answer: "The lecture is usually for teaching the concepts and a couple of examples.A tutorial is for problem - solving using the concepts taught in the lecture.The laboratory is just a lab; it's for doing experiments related to the course.",
        },
        {
            question:
                "Will it be possible to rearrange our timetable if we don't find the one we made yesterday suitable for ourselves? And how does enrolling in classes work?",
            answer: "Not allowed.If you mean cms, you'll just have to look for the course in cms and then enroll for the course yourself.",
        },
        {
            question: 'Enrolment in cms',
            answer: "Go to cms, log in using bits mail, click all courses, type the course code in search, find your respective section(like L1, T3, etc etc.U can find this in your ERP timetable).Make sure to enroll in every course master section(it is denoted by L with no number after it, and it is P in the case of pure lab courses), these are usually where each course common announcements are done.Individual sections are used for that section's announcements and information.",
        },
        {
            question: 'How and when can we join clubs ?',
            answer: "Each club will hold inductions.you will have to join when they put inductions.You can join whenever you feel like joining, and there's an induction (usually once every sem).",
        },
        {
            question: 'Any access to the Online library ?',
            answer: 'Search library OPAC on google, and you will find a link, just follow that and click this.',
        },
        {
            question: 'How does the cgpa / sgpa system work ?',
            answer: `I give an example scenario, suppose you write 3 subjects A, B, C in a semester.The credits for each are 3, 2, 4 respectively and your grades in those courses are 9, 4, and 10 respectively.Now your CG would be(9 * 3 + 4 * 2 + 10 * 4) / (3 + 2 + 4)=8.33. Now going to the second sem, in which you take 4 courses.Credits are 1, 1, 3, 2 and grades are 6, 7, 10, 8. Now the sg of this semester would be(6 * 1 + 7 * 1 + 10 * 3 + 8 * 2) / (1 + 1 + 3 + 2)= 8.42
            Now coming to the CG calculation based on the SGs.It is NOT 8.33 + 8.42 / 2
            your CG would be calculated in the same way: CG = (8.33(3 + 2 + 4) + 8.42(1 + 1 + 3 + 2)) / (3 + 2 + 4 + 1 + 1 + 3 + 2).As u can see the same formula applies for sg as well as CG the only difference is that when calculating sg u only take into the semester's courses and while calculating CG you take into account all the courses you have done in college. So obviously in the first sem SG=CG but after that, it's not.
            `,
        },
        {
            question:
                'Is maintaining a 7.5 cgpa for a semester very tough, or how is it ?',
            answer: "7 is like the average; it's decently easy to get around. Put in a little more effort, and you can get 7.5. Try your best to maintain 7+ throughout college.",
        },
        {
            question:
                'What is the zero attendance policy ? Where is it not applicable ?',
            answer: `it just means you don't have to attend the damn classes. Other colleges usually have like a minimum of 85% attendance required or else u won't be allowed to sit for the final exam.There's no such rule here. You have to attend classes where evaluations are being conducted, all labs, and days where evaluations are being conducted. You can attend, or else you will lose marks.`,
        },
        {
            question:
                'Should we make fair notes(like in school or even jee) for all subjects',
            answer: "You can make it if you want; there's no necessity. You can study however you want. If you don't need notes, don't make🤷‍♀️🤷‍♀️",
        },
        {
            question:
                'How vital is Facebook for BITS Hyderabad announcements ?',
            answer: 'It’s pretty important because most of the announcements happen in the shoutbox group on Facebook.Another important group is the FEG Group.',
        },
        {
            question: 'How to cope with Midsems ?',
            answer: `Since your midterm exams are coming up, I wanted to wish you guys good luck.Some suggestions,
            1. College is not a black hole that will suck you up or suck up all your happiness, it depends on how you see things, midterms are just one part of the multiple evaluatives that happen in a semester.College chooses to award consistent performance over a single exam like what you have done till now in your life.
            2. Suppose you fuck up midterms or get a bad grade, it's no reason to be down, I've seen multiple people cover a lot of ground in comprehensive examinations alone to improve grades by 2 / 3 points also.I have personally done it too.
            3. Don't get tensed before the exam. I understand it's your first exam but there is no need to fret.Go and write your exam.Mettl invigilators don't bother you too much. ID card and shit u can use any ID, not necessarily college ID, 360s are rarely asked. Just make sure you keep enough time to scan your answer sheets, you don't have to worry about anything else.
            4. In case you aren't able to scan and upload in time, immediately mail your answer sheet to your IC. So keep your IC emails nearby
            Everything else is kinda lite, don't worry, write nicely`,
        },
        {
            question: 'What if you fail an exam ?',
            answer: `Idk why you are thinking failing a course will happen so easily.Bits don't fail people so easily, they usually only fail you if your course total is less than 10%, i.e, 30/300 which all of you have. Worst case 15%, which is very, very, very rare. The only other way to fail is missing comprehensive examinations completely, both makeup and normal
            Don't go around saying shit as you'll fail after one quiz.And percentile of the quiz is not the only thing that determines your grade, then why are u writing these many exams, all of their accounts for your grades? It's a cumulative system.
            Useless predictions based on quiz percentiles will only give unnecessary hope to people or it will unnecessarily demote some others.Don't do stuff like that.
            Plus, ek subject mein thoda kam aayega toh kuch nahi hoga.First year mein lagta hai ki ek course ki grade bahut badalta hai, but that's only cuz credits are less it'll make a huge diff in sg.But later as years go on with increasing credits, ek grade ka hai bahut chotta hota hai
            Please don't get discouraged due to one exam or one subject. 😔😔`,
        },
        {
            question: 'Interactions on campus',
            answer: `You can say no; there’s nothing wrong with saying no to something you don’t want to do, 
            and no one will force you to do anything. In fact, most seniors do and will ask for your consent.
            Know the intro format.Name, Id number(2022 Branch code (Ax or Bx) xxxx(last four digits), 
            these numbers are meant to be said separately, 2022 is two zero two two. Then comes where you’re from, 
            and finally, your hobbies and interests.Be open while talking about these, as this is where most of 
            the conversation you’ll have with your seniors will branch out from. Very important tip, be shameless, 
            but not disrespectful, no matter which branch, year, or what cg the senior has. 
            In the end, they are your seniors and deserve respect. Make a good impression during 
            these interactions, and you’ll get good connections with your seniors in various clubs and departments.
            And this is also how you get your books, from talking to seniors, 
            and they’ll approach you to sell books (humme bhi paise chahiye :”)). 
            Good interaction implies more discounts on books and a nice treat.                `,
        },
        {
            question: 'Facilities on Campus',
            answer: `Now coming to the facilities on campus, though you’ll get acquainted with most of these while exploring, and some seniors might even take you on a detailed campus tour after your interactions (where some second year seniors may get interacted by 3rd and 4th years in front of you, cause life happens ;-;), but here are some things you’ll find on campus.
                    Outlets for food. Old football ground/hockey field. New football ground, tinkerer’s lab,  swimming pool, cricket nets. Academic blocks(Workshop, Sandbox, Library, Auditorium, Amphitheater, Canteen, Classrooms and labs (unfortunately)). Student Activities Center(Gym, Indoor badminton court, Snooker/Pool Tables, Table tennis room, Several club rooms (music, dance, etc)). Connaught Place (or better known as CP): Stores and Stationary.`,
        },
        {
            question: 'What are Projects and how do they work?',
            answer: `
            Study Project - SOP - theoretical - reading other research papers and writing a report. Lab Project- LOP. Design Project- DOP - gray area, whatever doesn't come under SOP and LOP.
            Can start applying for projects at the end of 2-2, will get project bank in 2-1. Pre register for project important- mail the prof, only after that you can register. You can apply for projects of other depts but it will come under OPEL.
            Prof can take max 12 students in a project. CS project - good relation w prof, good cg, should be pro. You can do only one project per semester except in 4th year if you are a singilite.
            In 2-2 can apply only for SOP, from 3rd and 4th yr can apply any type project. max 3 projects can be counted as DEL.Informal project - for experience, resume, not graded but good to have projects for MS + placements - will get you LORs`,
        },
        {
            question: 'HuELs = Humanities Electives (HSS, GS in doc)',
            answer: 'Only few courses are offered every semester, check doc carefully to see which ones are offered this sem. You will have to do 3 huels',
        },
        {
            question: 'DELs = Disciplinary Electives',
            answer: "Electives related to dept GXXX denotes higher degree course. All single degree branches expect chem need 4 courses (12 creds), chem needs 5 courses (15 cred). Phoenix has 2 cred lab courses (other branches don't)",
        },
        {
            question: 'OPELs = Open Electives',
            answer: 'Anything that is neither CDC nor DEL. 5 courses - 15 creds. Need to be careful of cred requirements and order',
        },
        {
            question: 'Summer Internship?',
            answer: `Drive starts after 2-2, come in 3-1, 3-2. All companies hold coding and interview rounds.SI gives you a good stipend and a chance of PPO.In general CG cutoff - 7.5 and there are Restrictions in branches.These companies will come on superset and you apply there with your resume.Create resume for company you want to apply to, then coding round, 1 / 2 interview rounds.If you get SI, cant go for 4 - 1 PS,
            PS will be in 4 - 2 and placements in 4 - 1. https://docs.google.com/presentation/d/1Gk-_2DuInZjV1yo0RvJ3iGSwG_4MPGvrUtw6bmwud_s/edit#slide=id.gb83e9fc38f_0_84 -> SI Presentation
            If you get offer, you have to accept it.otherwise you may not be allowed to sit for placements.You can go for off campus SI and this drive is diff for diff campuses.Once you get offer, the drive for you in done.You won & apos;t know the order in which the companies come, so it is up to you to decide which ones to apply for.The higher stipend ones may come earlier / later and you may miss out on those.
            placement points → if you hit 0 from 10, you can & apos;t sit for SI / placements anymore`,
        },
    ]

    return (
        <>
            <Meta {...getMetaConfig('faqs')} />
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px]">
                        FAQs.
                    </h1>

                    <Menu />

                    <input
                        type="text"
                        placeholder="Search the faqs..."
                        className="input input-secondary w-full max-w-xs"
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>
            </div>
            <div className="grid p-5">
                <div className="w-50 flex flex-col justify-between py-2">
                    {faqs
                        .filter((f) =>
                            f.question
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        )
                        .map((faq) => (
                            <div
                                tabIndex={0}
                                key={faq.question}
                                className="collapse collapse-plus border border-primary-300 bg-base-100 rounded-box m-2"
                            >
                                <div className="collapse-title text-lg font-medium">
                                    {faq.question.toUpperCase()}
                                </div>
                                <div className="collapse-content">
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
}
