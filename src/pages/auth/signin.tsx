import { signIn , signOut , useSession } from "next-auth/react"
import { useEffect } from 'react';
import { GetServerSideProps } from "next";
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import Head from 'next/head';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import { useState } from 'react';
import { customRandom, random } from "@import/utils/random/number";

type GoogleType = {
    email:string
}

type GuestType = {
  email:string,
  password:string
}

type ActionProvider = {
    google:Function,
    credentials:Function
}

type Props = {
  session:Session
}

type DataProviderAuth = {
      classes : { icon:string , wrapper:string },
      icon:JSX.Element,
      label:string,
      action:(props:ActionProvider) => void
}


const data:DataProviderAuth[] = [
    {   
        classes:{ icon:'google-icon' , wrapper:'wrapper-google-icon'  },
        icon:<svg stroke="currentColor" fill="currentColor" strokeWidth="0" version="1.1" x="0px" y="0px" viewBox="0 0 48 48" enableBackground="new 0 0 48 48" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
	c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
	c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
	C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>,
        label:'Google',
        action:async(action)=> action.google()
    }
]

const className = (...classes:any[])=> classes.filter(Boolean).join(' ');

const Copyright =()=> <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 22c5.421 0 10-4.579 10-10S17.421 2 12 2 2 6.579 2 12s4.579 10 10 10zm0-18c4.337 0 8 3.663 8 8s-3.663 8-8 8-8-3.663-8-8 3.663-8 8-8z"></path><path d="M12 17c.901 0 2.581-.168 3.707-1.292l-1.414-1.416C13.85 14.735 12.992 15 12 15c-1.626 0-3-1.374-3-3s1.374-3 3-3c.993 0 1.851.265 2.293.707l1.414-1.414C14.582 7.168 12.901 7 12 7c-2.757 0-5 2.243-5 5s2.243 5 5 5z"></path></svg>


const Alert = withReactContent(Swal);

interface InputHtml extends HTMLElement {
    value?:string
}

export default function Auth(props:Props){
      const session = props.session

      useEffect(()=>{
          if(session){
            self.location =  '/' as string & Location
          }
          return ()=>{}
      },[])

      const WithGoogle = ()=> { 

            signIn('google',{
                redirect:true,
                callbackUrl:'/vote/list'
            });
      }

      const WithGuest = async(email:string,password:string)=> { 
            

            Alert.fire({
                html:<div className="w-full h-full flex flex-col items-center  justify-center">
                    <input type="email" placeholder="Your email" id="email-field" className="w-full h-[40px] mb-2 border-b-[1px] px-2 border-b-blue-500 font-inter-regular text-gray-600 focus:outline-none" />
                    <button 
                    className="w-full h-[40px] bg-blue-500 font-inter-regular text-white flex items-center justify-center rounded-md"
                    onClick={async()=>{
                          Swal.showLoading();
                          
                          const doc:InputHtml|null = document.getElementById('email-field');
                          const email = doc?.value as string

                        if(email.includes('@gmail.com')){
                            const body = { 
                                email:email,
                                password:customRandom('abcdefghijklmopqrstuvwxyz1234567890!@#$%^&*()_+',12,random)()
                            }


                            signIn('credentials',{
                                ...body,redirect:true,callbackUrl:'/p'
                            }).then((result)=>{
                                Swal.hideLoading() 
                              Alert.fire({ title:<p className="font-inter-regular text-sm">Login With Guest Account Success</p> , showConfirmButton:false,timer:300})
                    
                            }).catch((error)=> console.error(error))

                        }

                    }} >Submit</button>
                </div>,
                showConfirmButton:false,
                customClass:{
                    container:' margin:1em 0.6em .3em'
                }
            })         
      }

      return (
          <div className="w-full h-[100vh] bg-white flex items-center justify-center">
              <Head>
                  <title>Signin Votsy</title>
              </Head>
              <div className="flex flex-col items-center gap-5">
                  <div className="flex flex-col gap-3">
                      {
                        !session && data.map((e,i,a)=>(
                            <div
                            key={i} 
                            onClick={()=> e.action({ 
                                google:()=> WithGoogle() , 
                                credentials:()=> WithGuest('raflysyahr@gmail.com','12345678')  
                            })}
                            className={className(
                            "cursor-pointer md:w-[300px] w-[250px] lg:w-[300px] h-[40px] shadow-sm ",
                            "flex items-center gap-2 rounded-md overflow-hidden",
                            "bg-gray-100")}>

                                <div className={className(
                                    "w-[40px] h-[40px] bg-gray-100 flex items-center justify-center"
                                    )}>
                                    {e.icon}
                                </div>
                                <p className="font-inter-regular text-sm">Login With {e.label}</p>
                            </div>
                        ))
                      }
                     {/* {session && 
                        <>
                           <button onClick={()=> signOut()} className="w-[300px] h-[40px] flex items-center justify-center logout rounded-md font-inter-regular text-sm">Logout</button> 
                           <Link href='/'
                            className="mt-2 text-sm w-[300px] h-[40px] flex items-center justify-center font-inter-regular">
                                Home
                            </Link>
                        </>
                     } */}
                      {/* <div>
                        <p className="font-inter-thin text-sm">Free make vote from anywhere</p>
                        <small className="text-gray-600 flex items-center gap-1 font-inter-regular">Copyright <Copyright/> reserved | vote system {new Date().getFullYear()} </small>
                      </div> */}
                  </div>
              </div>
              <style jsx>
                {
                  `
                    .logout {
                        background:linear-gradient(3deg, red, #ffd8d8);
                        color:white;
                    }

                    .google-icon {
                        background:linear-gradient(10deg, #260b91, #87a4ff);
                    }
                    .wrapper-google-icon {
                        background:linear-gradient(358deg, #260b91, #87a4ff);
                        color:white;
                    }
                    
                    .guest-icon {
                        background:linear-gradient(15deg, #00ff66, #c4e3ee);
                    }
                    .wrapper-guest-icon {
                        background:linear-gradient(358deg, #00ff66, #c4e3ee);
                        color:#595656;
                    }
                  `
                }
              </style>
          </div>
      )
}

export const getServerSideProps:GetServerSideProps = async({req,res})=>{
    const session = await getSession({req});

    if(!session){
        res.statusCode = 403;
        return { props:{}}
    }

    return { props:{ session } }


}
