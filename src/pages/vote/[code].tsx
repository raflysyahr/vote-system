import { useState , useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { votes } from '@prisma/client';
import Countdown from '@import/components/countdown/Countdown';
import Image from 'next/image';
import { VoteType } from '../../types/Vote';
import { useRouter } from 'next/router';
import moment from 'moment';
import useVote from '@import/lib/vote/useVote';
import axios from 'axios';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import Head from 'next/head';
import RestrictedPage from '@import/components/RestrictedPage';
import { getSession, signIn } from 'next-auth/react';
import { Session } from 'next-auth';
import { prisma } from '@import/lib/prisma';
import { ParticipantType } from '@import/types/Participant';
import { UserIcon } from '@heroicons/react/24/outline';

const Alert = withReactContent(Swal)

type propsVoting = {
    votes:VoteType,
    session:Session,
    // selected_vote:ParticipantType | null
}

const url_fetch = process.env.NODE_ENV == 'development' ? 'http://localhost:3000/api/v1' :'https://appvote.vercel.app/api/v1'

const className = (...classes:any[])=> classes.filter(Boolean).join(' ');


export default function Voting({ session }:propsVoting){

    const [selected_vote,setSelected_vote] = useState<ParticipantType | null>(null)

   
  const router = useRouter();
  const { code } = router.query
  
  const { data:dataApiVotes , error , isLoading } = useVote(code as string);

  const [dataVote,setDataVote] = useState<VoteType|null>(null);
  const [countdownState,setCountdownState] = useState<string>('NOT_START')

   
    useEffect(()=>{
        const getparticipant = async()=>{
            const result = await axios.get(`${url_fetch}/participant/get/${code}/me/${session.user.email}`)
            setSelected_vote(result.data.data)
        }

        getparticipant();

        return()=>{}
        
    },[])

  useEffect(()=>{
    if(dataApiVotes && dataApiVotes.data){
       
        setDataVote(dataApiVotes.data)
    }

    return ()=>{}

  },[dataApiVotes])

  const submitVote = (idcandidate:string)=>{
    if(dataVote?.email !== session?.user?.email){
                            
        Alert.showLoading();

        axios.post(`/api/v1/participant/${code}`,{
            idcandidate
        }).then(async(res)=> { 
            
            Alert.hideLoading();
            const url = process.env.NODE_ENV == 'development' ? 'http://localhost:3000/api/v1/' :'https://appvote.vercel.app/api/v1/'

            if(res.data.data){
                const selected_vote = await axios.get(`${url}participant/get/${code}?me=true&email=${session.user.email}`)
                setSelected_vote(selected_vote.data.data)
                setDataVote(res.data.data)
            }

            Swal.close();
            
            Alert.fire({
                title:<p className="font-inter-regular text-[15px]">{res.data.data ? "Voting is success" : res.data.message }</p>,
                showConfirmButton:false,
                timer:3000
            })

        }).catch((err)=> {
         
            Swal.close()
            
        })
        
    }else{
        Alert.fire({
            title:<p className='text-sm text-center font-inter-regular '>Owner can't join the vote</p>,
            showConfirmButton:false,
            timer:3000
        })
    }
  }

  const sendVote = (idcandidate:string)=>{
  
    if(!selected_vote && session ){

        if(countdownState ==="START" ){
            if(dataVote?.email !== session?.user.email){
    
                Alert.fire({
                    title: <p className="font-inter-regular text-[15px]">Are you sure?</p>,
                    html:<div className="flex flex-col items-center gap-3">
                        <button onClick={()=> submitVote(idcandidate)} className="w-[150px] h-[30px] flex items-center justify-center bg-blue-500 text-white font-inter-regular rounded-md">send vote</button>
                    </div>,
                    showConfirmButton:false,
                    scrollbarPadding:false
                })
    
            }else{
                Alert.fire({
                    title:<p className='text-sm text-center font-inter-regular '>Owners are not allowed to vote!</p>,
                    showConfirmButton:false,
                    timer:3000
                })
            }
        
        }else{

            Alert.fire({
                title:<p className="font-inter-regular bg-white rounded-full flex items-center justify-center h-[25px] text-[12px] text-red-400">Voting { countdownState === 'ENDED' && "has ended" }{ countdownState === 'NOT_START' && "hasn't started yet" }</p>,
                html:<div className="flex justify-center w-full"><div className='bg-white px-3 py-2 rounded-md pb-5 flex justify-center items-center'>
                    <Countdown spacing="mx-2 text-[20px]" labelSize="text-[12px]" numberSize='text-[18px]' start={dataVote?.startDateTime as Date} end={dataVote?.endDateTime as Date} countdownState={(value)=> setCountdownState(value)}/>
                </div></div>,
                showConfirmButton:false,
                timer:150000,
                background:'transparent',
                customClass:{
                    container:'',
                    htmlContainer:'w-full !mx-0 !mt-3'
                }
            })
            
        }    
    }else{
        if(!session){
            Alert.fire({
                html:<div className="w-full flex flex-col gap-3 items-center">
                    <p className='text-sm text-center font-inter-regular '>You are not logged in,please login or signup</p>
                    <button onClick={()=> router.push('/auth/signin') } className="bg-blue-500 text-white font-inter-regular w-[150px] h-[40px] flex items-center justify-center rounded-md">Login</button>
                </div>,
                showConfirmButton:false,
            })
        }else{
            Alert.fire({
                title:<p className='text-sm text-center font-inter-regular '>You has been send vote</p>,
                showConfirmButton:false,
                timer:3000
            })

        }
    }

      
  }


//   if(!session){
//       return <RestrictedPage />
// }



  return (
    <div className="w-full h-screen bg-white flex flex-col items-center justify-center relative">
        <Head>
            <title>{dataVote? dataVote.title : 'Not found'}</title>
        </Head>
       <div className="top-0 px-2 absolute w-full h-[40px] bg-white flex items-center">
            <div>
                <button className="w-[30px] text-white btn-3d text-[20px] h-[30px] flex items-center justify-center rounded-md" onClick={()=> router.push('/vote/list')}>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path></svg>
                </button>
            </div>
       </div> 
        <div className="w-full lg:w-[900px] md:w-[500px]">
            <div className="w-full flex justify-center">
                <h1 className="font-inter-exbold text-gray-700 uppercase text-center lg:w-full md:w-full w-[300px] text-[30px] ">{dataVote?.title}</h1>
            </div>
            <small className="w-full text-center block">{dataVote?.publisher}</small>
            <div className="flex justify-center mb-5">
                { dataVote?.scheduled && 
                <Countdown 
                start={dataVote.startDateTime} 
                end={dataVote.endDateTime} 
                spacing="mx-[2px] text-[19px]" labelSize="text-[14px]" numberSize='text-[23px]'
                countdownState={(value)=> setCountdownState(value)}/>}
            </div>
            <div className="w-full h-fit flex flex-col items-center gap-5 px-4 mb-5">
                  {
                      dataVote?.candidates ? dataVote.candidates.map((e,i,a)=>(
                          <div key={i}  
                               onClick={()=> sendVote(e.id)}
                               className={className(
                                    "hover:border-[1px] hover:border-blue-500 rounded-md cursor-pointer  w-fit lg:w-[350px] justify-center md:w-[450px] min-h-[60px] px-2  flex items-center gap-4 ",
                                    e.id === selected_vote?.idcandidate && "border-[1px] border-blue-500"
                               )}>
                              <div className="w-[50px] h-[50px] bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
                                {e?.image && e.image !== "" ? <Image className="rounded-full" width={50} height={50} src={e.image} alt={e.name} /> :
                                    <UserIcon width={20} className=''/>
                                }
                              </div>
                              <div className="w-[150px] md:w-[320px] lg:w-[220px] min-h-[50px] flex flex-col mt-1 gap-2">
                                  <p className="text-inter-regular">{e.name}</p>
                                  <div className="w-full h-[5px] bg-gray-100 rounded-full overflow-hidden">
                                      <div style={{width:(e.votes && dataVote.total ? (e.votes / dataVote.total * 100 ) : 0)+'%'}} className={` progress-3d h-[5px] rounded-full`} />
                                  </div>
                              </div>
                              <div className="flex gap-[2px] w-[40px] items-center">
                                 <div id="icon">
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" version="1.2" baseProfile="tiny" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 6c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3m0-2c-2.764 0-5 2.238-5 5s2.236 5 5 5 5-2.238 5-5-2.236-5-5-5zM12 17c2.021 0 3.301.771 3.783 1.445-.683.26-1.969.555-3.783.555-1.984 0-3.206-.305-3.818-.542.459-.715 1.777-1.458 3.818-1.458m0-2c-3.75 0-6 2-6 4 0 1 2.25 2 6 2 3.518 0 6-1 6-2 0-2-2.354-4-6-4z"></path></svg>
                                 </div>
                                 <small>{e.votes ? e.votes : 0 }</small> 
                              </div>
                          </div>
                      )) :
                      <div className="w-full h-full flex justify-center items-center font-inter-regulat text-gray-400 bg-white">
                        <p>Voting not found</p>
                    </div>
                  }
            </div>
        </div>
        <div className="absolute bottom-[20px] w-full pointer-events-none flex flex-col justify-center items-center">
            {
                dataVote?.email === session?.user?.email && 
                <p style={{background:"linear-gradient(94deg, #ff000000,#ff000059, #ff000000)"}} className='flex text-black text-sm absolute bottom-[30px]  italic rounded-sm h-[35px] items-center font-inter-regular w-fit px-5 py-[1px] z-[99] select-none pointer-events-none'>
                    Owner can't join the vote
                </p>
            }
            <p className="font-inter-regular text-[12px]">AppVote</p>
        </div>
    </div>
  )

}
export const getServerSideProps:GetServerSideProps = async({req,res})=>{
  
    

    const session = await getSession({req})

    if(!session){
        res.statusCode = 403
        return { props:{ } } 
    }
    

    const logininfo = await axios.get(`${url_fetch}/user/${session.user.email}`)
    const _code = req.url?.split('=')[1];

    


    

    return { props:{ session , user:logininfo.data.data }}
}

