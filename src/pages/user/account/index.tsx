import { GetServerSideProps  } from 'next';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import Image from 'next/image'
import { VoteType } from '@import/types/Vote';
import { UserInterface, AccountInterface } from '../../../types/user/index';
import PostVoting from '@import/components/PostVoting';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useRouter } from 'next/router';
import { BsGear } from 'react-icons/bs';
import { IoIosArrowBack } from 'react-icons/io';

const url_fetch = process.env.NODE_ENV === 'development' ?
'http://localhost:3000/api/v1' : 'https://appvote.vercel.app/api/v1';




type AccountDashboardProps = {
  session:Session,
  account:{
    user:UserInterface & AccountInterface,
    votes:VoteType[]
  }
}

export default function  AccountDashboard(props:AccountDashboardProps){
  
  const router = useRouter();
  
  return (
      
        <div className="w-full h-screen bg-white px-2 py-2 flex flex-col items-center">

            <div className='absolute top-[20px] left-[20px]'>
              <button onClick={()=>{
                router.replace('/vote/list')
              }} className="flex items-center justify-center w-[30px] h-[30px] bg-blue-500 text-white rounded-md">
                 <IoIosArrowBack/>
              </button>
            </div>
            
            <div className="absolute right-[20px] top-[20px]">
                {/* <button onClick={()=> router.push('/user/account/edit')} className="bg-gray-600 text-white w-[30px] h-[30px] flex cursor-ponter rounded-md justify-center  items-center">
                    <BsGear/>
                </button> */}
            </div>
            <div className="flex items-center flex-col w-full lg:w-[600px] md:w-[400px] bg-white gap-2 px-[30px] py-[30px]">
                <div id="avatar" className="ring-4 ring-blue-500 ring-offset-2 ring-offset-white overflow-hidden lg:w-[150px] lg:h-[150px] md:w-[100px] md:h-[100px]  w-[70px] h-[70px] rounded-full bg-gray-50 relative">
                      { props.account.user.image && <Image alt="pp" src={`${props.account.user.image}`} layout="fill" className="lg:w-[10px] lg:h-[150px] md:w-[100px] md:h-[100px] w-[70px] h-[70px] rounded-full relative" />}      
                </div>
                <p className="font-inter-exbold">{props.account.user.name || 'unknown'}</p>   
                <small className="font-inter-regular">@{props.account.user.username || 'unknown'}</small>
            </div>
            <div>
              <div className="w-full h-fit flex flex-wrap gap-2">
                  {
                    props.account.votes && props.account.votes.map((e,i,a)=>(
                      <PostVoting data={e} />
                    ))
                  }
              </div>
            </div>
        </div>
      
  )

}


export const getServerSideProps:GetServerSideProps = async ({req,res})=>{

  const session = await getSession({req});
  if(!session){
      res.statusCode = 401
      return { props:{}}
  }


  const user = await axios.get(url_fetch+"/user/"+session.user.email)

  const result:{ user?:any , votes?:VoteType[] } = {}

  if(user){
    
    let votes = await axios.get(url_fetch+"/vote/id/"+user.data.data.id);
    result.user  = user.data.data
    result.votes = votes.data.data

  }

  return { 
      props:{
          session:session,
          account:result
      }
  }

}
