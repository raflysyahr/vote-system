import { useState , useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession  } from 'next-auth/react';


const className = (...classes:any[])=>{
    return classes.filter(Boolean).join(' ')
}

export default function Home(){

    const { data:session } = useSession();




    return (
        <div className="w-full h-[100vh] bg-white" >  
          <Head>
              <title>Voting System</title>
          </Head>
          
          <div className="w-full h-full px-2 flex items-center justify-center">
              <div className='w-full h-[40px] absolute px-2 top-0 flex justify-between items-center'>
                <div></div>
                <div className='flex gap-2 items-center font-inter-regular'>
                  <p>{session?.user?.name}</p>
                  <div className='w-[30px] h-[30px] bg-gray-200 rounded-full'></div>
                </div>
              </div>
               <div>
                    <div className="relative ">
                      <small className="absolute md:top-0 top-[-10px] lg:top-0 w-[300px]  text-[16px] font-inter-regular text-gray-500">By raflysyahr</small>
                      <h1 className="font-inter-exbold text-gray-700 md:text-[60px] text-[40px] lg:text-[70px]" >Voting System</h1>
                   </div>
                    <div className="flex gap-2 mt-5">
                          <Link  
                            href="/vote/join"
                            className={className(
                            "bg-gray-700 font-inter-regular  relative text-white lg:w-[150px] md:w-[150px] w-[100px] md:h-[40px] h-[40px] lg:h-[40px] flex items-center justify-center duration-500",
                            "after:duration-700 transition-all  after:content-['Join'] after:flex after:justify-center after:items-center after:hover:top-[-5px] after:hover:left-[-5px]   after:absolute after:bg-gray-700 after:lg:w-[150px] after:md:w-[150px] after:w-[100px] after:md:h-[40px] after:h-[40px] after:lg:h-[40px] after:focus:left-0 after:focus:top-0",
                            "before:content-[''] before:absolute before:lg:w-[150px] before:md:w-[150px] before:w-[100px] before:md:h-[40px] before:h-[40px] before:lg:h-[40px] before:bg-gray-300"
                            )}></Link>
                          <Link 
                            href="/vote/create"
                            className="font-inter-regular bg-white border-[1px] border-gray-600 text-gray-700 flex items-center justify-center  w-[150px] h-[40px]">Create Vote</Link>
                    </div>
               </div>
           </div>
        </div>
    )

}
