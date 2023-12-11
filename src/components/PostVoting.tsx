import { VoteType } from "@import/types/Vote"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const url_fetch = process.env.NODE_ENV == 'development' ? 'http://localhost:3000/api/v1' :'https://appvote.vercel.app/api/v1'

type Props = {
    data:VoteType
}

export default function PostVoting(props:Props){
    const  [lengthOfParticipant,setLengthOfParticipant] = useState<number>(0);
    const router = useRouter();

    useEffect(()=>{
        axios.get(url_fetch+'/participant/'+props.data.code)
        .then((res)=>{
            if(res.data.data){
                setLengthOfParticipant(res.data.data.length)
            }
        }).catch((error)=>{})
        
    },[])

    return (
        <div onClick={()=>{
            router.replace('/vote/'+props.data.code)
        }} className='cursor-pointer w-[150px] h-[150px] bg-gray-100 rounded-md'>
            <p className='font-inter-regular w-full h-[40px] flex items-center justify-center'>{props.data.title}</p>
            <h1 className="w-full h-[110px] text-[40px] text-gray-500 flex items-center justify-center font-inter-exbold font-black">{lengthOfParticipant}</h1>
        </div>
    )


}