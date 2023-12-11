import { useRouter } from "next/router";
import { useState } from "react";
import Link from 'next/link';
import Head from 'next/head';
import RestrictedPage from '@import/components/RestrictedPage';
import { useSession } from 'next-auth/react';

const className = (...classes:any[])=> classes.filter(Boolean).join(' ');

export default function ParticipantPages(){
    const { data:session } = useSession();
    const [code,setCode] = useState<string|null>();



    const router = useRouter()

    const onJoin = (code:string)=>{
        router.push(`/vote/${code}`)
    }


    if(!session){
        return <RestrictedPage />
    }

    return (
        <div className="w-full h-[100vh] bg-white flex items-center justify-center px-3">
            <Head>
                <title>Join voting</title>
            </Head>
            <div>
                <h1 className="text-gray-600 font-inter-exbold md:text-5xl text-[30px] lg:text-5xl py-2">Join to voting</h1>
                <div className="flex flex-col gap-3">
                    <input type="text" 
                    onChange={(event)=>{

                        setCode(event.target.value)

                    }}

                    className="underline text-gray-400 focus:outline-none uppercase font-inter-regular w-[200px] h-[40px]" placeholder="Enter the code" />
                  <div className="flex items-center gap-4">
                      <button 
                       onClick={()=> onJoin(code as string)}
                       className={className(
                          "w-[100px] h-[35px] px-2 bg-gray-200 text-white font-inter-regular relative",
                        "after:w-[100px] after:flex after:duration-500 after:justify-center after:items-center after:h-[35px] after:bg-gray-800 after:content-['Join'] after:absolute after:top-0 after:left-0 after:hover:-translate-x-1 after:hover:-translate-y-1"
                        )}>
                        
                        </button>
                        <Link href="/" className="w-[100px] h-[35px] border-[1px] border-gray-800 flex items-center justify-center font-inter-regular">
                          Back
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
