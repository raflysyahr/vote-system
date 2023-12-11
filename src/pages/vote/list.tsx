import React from 'react';
import { GetServerSideProps  } from 'next';
import { LinkIcon, TrashIcon } from "@heroicons/react/24/outline";
import useVotes from "@import/lib/vote/useVotes";
import Head from 'next/head';
import { VoteType } from "@import/types/Vote";
import Link from "next/link";
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useRouter } from 'next/router';
import { useSession , getSession, signOut } from 'next-auth/react';
import RestrictedPage from '@import/components/RestrictedPage';
import ProviderFlashPopup, { FlashContext } from '@import/components/flashpopup/ProviderFlashPopup';
import useFlashPopup from '@import/components/flashpopup/useFlashPopup';
import CodePng from '@import/assets/image/crack.png';
import { Session } from 'next-auth';

import PullToRefresh from 'react-simple-pull-to-refresh';

//import checkCredentials from '@import/utils/check-credentials';

const Alert = withReactContent(Swal)

type Props = {
    session:Session,
    ListsVote:VoteType[],
    userInfo:any
}


const ListVote : React.FC<Props> =  ({ session , ListsVote , userInfo})=>{
    
    const FlashPopup = useFlashPopup()
    
    const [contentFlashPopup,setContentFlashPopup] = useState<JSX.Element>(<div></div>)
    const [showFlashPopup,setShowFlashPopup] = useState<boolean>(false)


    const router = useRouter();
    // const {data:dataApiVotes , error , isLoading } = useVotes();
    const [voteList,setVoteList] = useState<VoteType[]|null>(ListsVote)



    const onLogout = ()=> Alert.fire({
        title: <p className="font-inter-regular text-[15px]"></p>,
        html:<div className="flex flex-col items-center gap-3">



            <button onClick={()=> (Alert.close(),Alert.fire({
                title: <p className="font-inter-regular text-[15px]">Are you sure?</p>,
                html:<div className="flex flex-col items-center gap-3">
                    <button onClick={()=> (signOut({
                        callbackUrl:'/auth/signin',
                        redirect:true
                    }),Alert.close())} className=" text-sm w-[150px] h-[30px] flex items-center justify-center bg-red-500 text-white font-inter-regular rounded-md">Yes logout</button>
                </div>,
                showConfirmButton:false,
                scrollbarPadding:false
            }))} className=" text-sm w-[150px] h-[30px] flex items-center justify-center bg-red-500 text-white font-inter-regular rounded-md">Logout?</button>

        </div>,
        showConfirmButton:false,
        scrollbarPadding:false
    })


    const deleting = (code:string)=>  axios.delete(`/api/v1/vote/${code}`)
    .then((res)=>{ 

        if(res.data.data){
            Swal.close();
            setVoteList((prevState:VoteType[]|null)=>{ 
            return prevState ? prevState.filter((e,i,a)=> e.code !== res.data.data.code) : prevState
            })
            
            Alert.fire({
                title:<p className="font-inter-regular text-[15px]">You has been deleted vote {res.data.data.code}</p>,
                showConfirmButton:false,
                timer:2000
            })
        }

    }).catch((err)=> {})

    const onDelete = (code:string)=>{

        Alert.fire({
            html:
            <div className="flex flex-col items-center">
                <p className="font-inter-regular text-[18px]">Are you sure for delete this vote?</p>
                <div className="flex items-center gap-3 mt-5">
                  <button 
                  onClick={()=> Swal.close()}
                  className="w-[100px] h-[35px] text-sm rounded-md flex items-center justify-center text-white bg-red-500 font-inter-regular"
                  >Cancel</button>
                  <button 
                    onClick={()=> deleting(code)}
                    className="w-[100px] h-[35px] text-sm rounded-md flex items-center justify-center text-white bg-blue-500 font-inter-regular">
                      Sumbit
                  </button>
                </div>
            </div>,
            showConfirmButton:false
        })
    }

    if(!session){
        return <RestrictedPage/>
    }

    const HtmlPopup = ({data}:{data:VoteType})=>(
        <div className="flex justify-between items-center font-inter-regular gap-3">
            <div className="text-green-500">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm106.5 150.5L228.8 332.8h-.1c-1.7 1.7-6.3 5.5-11.6 5.5-3.8 0-8.1-2.1-11.7-5.7l-56-56c-1.6-1.6-1.6-4.1 0-5.7l17.8-17.8c.8-.8 1.8-1.2 2.8-1.2 1 0 2 .4 2.8 1.2l44.4 44.4 122-122.9c.8-.8 1.8-1.2 2.8-1.2 1.1 0 2.1.4 2.8 1.2l17.5 18.1c1.8 1.7 1.8 4.2.2 5.8z"></path></svg>
            </div>
            <p className="text-sm">Copied {data.code} to clipboard</p>
        </div>
    )

    return(
        <PullToRefresh 
        backgroundColor='white'
        pullingContent={ <div className='font-sm font-inter-regular'> ↧  pull to logout  ↧ </div> }
        refreshingContent={<div className="w-ful flex items-center justify-center bg-white h-[50px]"></div>}
        onRefresh={onLogout}>

            <div className="w-full h-screen bg-white ">
                {/* if accountha not been verified */}
                { userInfo && !userInfo.emailVerified && <div 
                  className="font-inter-regular text-[13px] gap-2 w-full fixed top-0 flex items-center justify-center bg-gray-50 h-[40px]">
                    <p>your account has no been verified</p>
                    <button className="text-blue-500">verified?</button>
                </div> }
                {/* end ; if accountha not been verified */}

                <Head>
                    <title>Lists vote</title>
                </Head>
                <div className="px-3 py-3 flex flex-col gap-3">
                    <p className=" text-[45px] font-inter-exbold text-gray-800">Your votes</p>
                    <Link href={'/vote/create'} 
                    className="w-[130px] border-0 h-[30px] text-sm btn-create-vote font-inter-regular flex justify-center items-center rounded-md">
                        Create new vote
                    </Link>
                </div>
                <div className="w-full px-3 py-2 flex lg:flex-row lg:flex-wrap flex-col gap-5">
                    {
                        voteList && voteList.map((e,i,a)=>(
                            <div 
                            
                            key={i} className="hover:shadow-none duration-500 lg:w-[300px] flex items-center    justify-between rounded-md w-full h-[50px] px-2">
                                <div onClick={()=> router.push(`/vote/${e.code}`)} className="cursor-pointer">
                                    <p className="font-inter-regular">{e.title}</p>
                                    <small className="text-[10px] font-inter-regular">Candidates {e.candidates.length}</small>
                                </div>
                                <div className="flex items-center gap-5">
                                    <div className="font-inter-exbold text-[14px] text-gray-500 text-end">{e.code}</div>
                                    <div className="flex flex-col gap-2 py-2">
                                        <LinkIcon 
                                        onClick={()=> navigator.clipboard.writeText(`http://localhost:3000/vote/${e.code}`).then(()=>{
      
                                            FlashPopup.showFlashPopup({
                                               html:<HtmlPopup data={e} />,
                                               timer:3000
                                            })

                                        })}
                                        className="cursor-pointer"
                                        width={14}/>
                                        <TrashIcon 
                                        onClick={()=> onDelete(e.code as string)}
                                        className="cursor-pointer"
                                        width={14}/>
                                    </div>
                                </div>
                            </div>
                        ))
                    }

                </div>
                <style>
                    {
                    `
                        .btn-create-vote {
                            background:linear-gradient(358deg, black, #8f8d8d);
                            color:white;
                        }
                    `
                    }
                </style>
            </div>
        </PullToRefresh>
    )

}


export default ListVote


export const getServerSideProps:GetServerSideProps = async({req,res})=>{
    
  const session = await getSession({req});
  const url = process.env.NODE_ENV == 'development' ? 'http://localhost:3000/api/v1' :'https://appvote.vercel.app/api/v1';

  if(!session){
      res.statusCode = 401;
      
      return { props:{} }
    }
    

   const data = await axios.get(url+"/vote",{
         withCredentials:true
   })

   const user = await axios.get(url+"/user/"+session.user.email)
    
  

    return { 
        props:{
        session ,
        ListsVote:data.data.data?.filter((e:any,i:number,a:any[])=> e.email === session.user.email),
        userInfo:user.data.data
        }
    }

}
