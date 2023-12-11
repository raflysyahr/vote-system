import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { prisma } from '@import/lib/prisma';
import { Session } from 'next-auth';
import { user } from '@prisma/client';
import { useEffect, useState } from 'react';
import Dexie, { Table } from 'dexie';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { AiOutlineLoading } from 'react-icons/ai'
import axios from 'axios';
import Countdown, { CountdownRendererFn } from "react-countdown";
import { useRouter } from 'next/router';
import RestrictedPage from '@import/components/RestrictedPage';

const url = process.env.NODE_ENV == 'development' ? 'http://localhost:3000/api/v1' :'https://appvote.vercel.app/api/v1';


type Props = {
    session:Session,
    user:user
}

type storeTable = {
    launch?:Table
}

type guestStatus = 'LOADING'|'ERROR'|'VERIFIED'|'CREATED'


const Alert = withReactContent(Swal);

export default function InitializeNewUser({ session , user}:Props){

    const router = useRouter();
    const [loading,setLoading] = useState<boolean>(false)
    const [guestStatus,setGuestState] = useState<guestStatus>('LOADING')
    const [taken,setTaken] = useState<boolean>(false);
    const [username,setUsername] = useState<string>('')

    useEffect(()=>{
        if(user.username !== null){
          location.href = '/vote/list'
        }

       



        return () => {}

    },[user])



    const rendererCountDown:CountdownRendererFn = ({ days , hours , minutes , seconds , completed})=>  {
        // if(completed){
        //     router.push('/vote/list')
        // }

        return (
            <div className="w-fit items-center justify-center">
                <h1 className="font-inter-exbold text-[30px] text-gray-700">{seconds}</h1>
            </div>
        )
    }


    const onChange = (event:any)=>{
        const value = event.target.value
        setUsername(value)
        if(value.length > 6){
            axios.get(`${url}/user/username/${value}`).then((result)=>{
                const val = result.data.data
                setTaken(val)
            }).catch(errr=> {})
        }
    }

    const onSubmit = ()=>{
        Alert.showLoading()
        if(username.length > 6 && !taken){
            axios.put(url+"/user/username/set",{ username }).then((res)=>{
                

                Alert.hideLoading()
                Alert.fire({
                    title:<p className="text-sm font-inter-regular">Successfully to set username</p>,
                    showConfirmButton:false
                })

                setTimeout(()=> {
                    Alert.close()
                    router.push('/vote/list')
                },1000)

            }).catch((err)=> {})
        }
    }

    if(!session){
        return (<RestrictedPage />)
    }

    return (
        <div className="bg-white  w-full h-screen font-inter-regular">
            {
                !user.emailVerified && 
                <div className="flex gap-2 justify-center items-center w-full h-[35px] bg-gray-50 font-inter-regular text-sm ">
                    <p>your account has no been verified</p>
                    <button className="w-fit px-2 rounded-full cursor=pointer bg-blue-500 text-white">verify</button>
                </div>
            }

            <div className="w-full h-screen ">
                <div className="w-full h-full flex items-center justify-center flex-col gap-2 px-3">
                    <p className="font-inter-exbold text-[25px]  md:text-[50px] lg:text-[60px]">Set your username</p>
                    <input onChange={onChange} placeholder="Type username" className="lg:w-[300px] md:w-[300px] w-full h-[40px]  focus:outline-none rounded-md px-2 shadow-md" />
                    {taken && username.length > 6 && <small className="text-red-500">username is already taken</small> }
                    {username.length !== 0  && username.length < 7 && <small className="text-red-500">username must be more than 6</small> }
                    <button onClick={onSubmit} className="flex items-center justify-center w-[150px] h-[40px] bg-blue-500 rounded-md font-inter-regular text-white mt-3">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}


export const getServerSideProps:GetServerSideProps = async({req,res})=>{

    const session = await getSession({req})

    if(!session){
        res.statusCode = 403
        return { props:{}}
    }
    
    
    const logininfo = await axios.get(`${url}/user/${session.user.email}`)
    
    const user = logininfo.data.data && logininfo.data.data.emailVerified === null && logininfo.data.data.account.provider === 'google' ? 
    await axios.put(url+"/user/verif",{ email:logininfo.data.data.email }) : logininfo 
    

    return { props:{ session , user:user.data.data}}

}
