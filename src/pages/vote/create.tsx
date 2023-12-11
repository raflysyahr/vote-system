import { DetailedHTMLProps, HTMLAttributes, MutableRefObject, useRef, useState , useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Input from '@import/components/form/Input';
import DatePick from '@import/components/DatePick';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios';
import { useRouter } from 'next/router';
import code from '@import/utils/random/code'
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import { VoteType } from '@import/types/Vote';
import { getSession } from 'next-auth/react';
import RestrictedPage from '@import/components/RestrictedPage';
import { Session } from 'next-auth';
import Image from 'next/image';

const Alert = withReactContent(Swal)


const className = (...classes:any[])=> classes.filter(Boolean).join(' ')

interface OptionVote {
    id:string,
    image:string,
    name:string,
    title?:string
}

type submitCandidateType = {
    vote:OptionVote,
    value:string
}

type submitCandidateThumbnailType = {
    vote:OptionVote,
    value:any
}

type scheduledTimeType = {
    start:Date|null,
    end:Date|null
}

type Props = {
    session:Session
}

export default function createVoting({ session }:Props){
    
    const router = useRouter();
    const [countOption,setCountOption] = useState(1);
    const [titleVote,setTitleVote] = useState<string>("");
    const [optionVote,setOptionState] = useState<OptionVote[]>([{
        id:code(20),
        image:'',
        name:'',
    }])

    const [scheduledTime,setScheduledTime] = useState<scheduledTimeType>({
        start:new Date(),
        end:new Date()
    });



    const addCandidate = ()=>{
        if(optionVote.length < 4){
          setOptionState((prevState:OptionVote[])=>{
              
              return [...prevState,{
                 id:code(20),
                  image:'',
                  name:''
              }]
          })
        }else{
            Alert.fire({
                title: <p className="font-inter-regular text-[15px]">Maximum Candidate 4</p>,
                timer:2000,
                showConfirmButton:false
            })

         }
    }


    const ChangeValue = (value:submitCandidateType)=>{
        setOptionState((prevState:OptionVote[])=>{
            const findCandidate = prevState.map((e,i,a)=> { 
                if(e.id === value.vote.id){
                    e.name = value.value
                    return e
                }else{
                    return e
                }
            }) 

            return findCandidate
        })
    }


    const ChangeThumbnail = (value:submitCandidateThumbnailType)=>{

        const rf = new FileReader();
        rf.readAsDataURL(value.value.target.files[0])
        rf.onloadend = ()=>{
            const base64:string = String(rf.result)
            setOptionState((prevState:OptionVote[])=>{
                const findCandidate = prevState.map((e,i,a)=> { 
                    if(e.id === value.vote.id){
                        e.image = base64
                        return e
                    }else{
                        return e
                    }
                }) 
    
                return findCandidate
            })

        }

    }



    const onDeleteCandidate = (id:string)=>{
        setOptionState((prevState:OptionVote[])=>{
            const filter = prevState.filter((e,i,a)=> e.id !== id)
            return filter
        })
        
    }


    const alertResponseVote = (code:string)=>{
        Alert.fire({
            title: <p className="font-inter-regular text-[15px]">Vote was created</p>,
            html:<div className='overflow-hidden'>
                <div className='flex items-center justify-center'>
                    <p  id="code-result" className="font-mono w-[270px] h-[40px] flex items-center justify-center">{code}</p>
                    <div 
                    onClick={()=> navigator.clipboard.writeText( document.getElementById('code-result')?.textContent as string ) }
                    className='absolute right-[10px] flex items-center justify-center px-2 w-[30px] h-[30px] rounded-md bg-white hover:bg-gray-200'>
                        <ClipboardDocumentIcon width={15} />
                    </div>
                </div>
                <div className='overflow-scroll w-full flex items-center justify-center hide-scrollbar'>

                    <div 
                    onClick={(event)=> navigator.clipboard.writeText(event.currentTarget.textContent as string) }
                    className="w-[316px]  h-[40px] font-mono text-[15px] flex items-center justify-center">
                        {location.host}/vote/{code}
                    </div>
                </div>
                <button 
                onClick={()=> (router.push(`/vote/${code}`),Alert.close())}
                className="w-full mt-3 h-[35px] bg-blue-500 text-white font-inter-regular rounded-md">
                    Visit
                </button>
            </div>,
            showConfirmButton:false
        })
    }

    const onSubmitForm = ()=>{

        const remake = optionVote.map((e,i,a)=> {e.title = titleVote; return e})

        Swal.showLoading()

        if(optionVote.length !== 0 && titleVote && scheduledTime.start && scheduledTime.end ){

            axios.post('/api/v1/vote/create',{
                title:titleVote,
                startDateTime :scheduledTime?.start,
                endDateTime :scheduledTime?.end,
                candidates :remake,
                scheduled:true
            }).then((res)=> {
                Swal.hideLoading()
                if(res.data.data){
                    alertResponseVote(res.data.data.code as string)
                }
    
            }).catch((err)=> {
               
            })
        }else{
            Alert.fire({
                html:<p className="text-[13px] font-inter-regular">You have not entered data for voting,please enter data voting</p>,
                timer:40000,
                showConfirmButton:false
            })
        }


    }




    const onChangeDate = (type:'start'|'end',value:Date|null)=>{
        setScheduledTime((prevState:scheduledTimeType)=>{
            if(type === 'start'){
                return {
                    start:value,
                    end:prevState?.end == null ? new Date() : prevState.end
                }
            }else if(type === 'end'){
                return {
                    start:prevState?.start == null ? new Date() : prevState.start,
                    end:value,
                }
            }else{
                return prevState
            }
        })
    }
    if(!session){
        return <RestrictedPage />
    }

    return  ( 

        <div className="w-full min-h-[100vh] bg-white ">
            <Head>
                <title>Create Voting</title>
            </Head>
            <div className="px-5 py-2 w-full h-full bg-white">
                <div className="w-full h-[40px] bg-white flex items-center">
                    <button 
                      onClick={()=> router.push('/vote/list')}
                      className="flex items-center justify-center w-[30px] h-[30px] rounded-md text-[20px]">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path></svg>
                    </button>
                </div>
                <h1 className="font-inter-regular text-[20px] text-gray-500 text-center">Create your vote</h1>
                <div className="mt-5 flex flex-col justify-center w-full items-center">
                  <input  
                    className={className(
                      " lg:w-[500px] md:w-[400px] w-full bg-transparent text-gray-500 h-[50px] text-[40px] font-inter-exbold",
                      "focus:outline-none"
                    )}
                    type="text" onChange={(event)=> setTitleVote(event.target.value)} placeholder="Title Voting"   />
                    <div className='flex md:flex-row lg:flex-row flex-wrap gap-2 mt-4'>
                        <div className="relative gap-2 flex flex-col">
                            <p className="font-inter-regular">Start</p>
                            <DatePick changeValue={(value)=> onChangeDate('start',value)} />
                        </div>
                        <div className="relative gap-2 flex flex-col">
                            <p className="font-inter-regular">End</p>
                            <DatePick changeValue={(value)=> onChangeDate('end',value)}/>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-3 w-full lg:w-[500px] md:w-[400px]">     
                        {
                            optionVote.map((data,index)=>(
                                <div  key={index} className='w-full duration-700 h-fit relative flex group-hover:bg-red-400'>
                                    <div  className="relative lg:w-[500px] md:w-[400px] w-full h-[60px]   overflow-hidden flex flex-shrink-0 gap-2" >
                                        
                                        <label htmlFor={`thumbnail-image-${data.id}`} className={className(
                                            "lg:w-[60px] md:w-[60px] w-[60px] md:h-[60px] h-[55px] lg:h-[60px] rounded-full overflow-hidden bg-white",
                                            data.image === '' ?
                                                "flex items-center justify-center text-[30px] text-gray-200"
                                            :""
                                            )}>
                                            {data.image === '' ? <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M4 5h13v7h2V5c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h8v-2H4V5z"></path><path d="m8 11-3 4h11l-4-6-3 4z"></path><path d="M19 14h-2v3h-3v2h3v3h2v-3h3v-2h-3z"></path></svg>  :
                                            <Image width={100} height={100}  src={data.image} alt="l"   />}
                                        </label>
                                        <input id={`thumbnail-image-${data.id}`} type={'file'} hidden onChange={(value:any) => ChangeThumbnail({vote:data,value:value})} />

                                        <div className=" lg:w-[440px] md:w-[340] w-[85%]  font-inter-bold tetx-[20px] text-gray-500 focus:outline-none h-full bg-white">
                                            <Input type='text' 
                                            placeholder='Candidate name'
                                            valueChange={(value:string)=> ChangeValue({value:value,vote:data})} />
                                        </div>
                                    </div>
                                    <div onClick={()=> onDeleteCandidate(data.id)} className=' cursor-pointer absolute right-0 w-[10px] rounded-bl-md rounded-tl-md h-[60px] group-hover:bg-red-400 bg-gray-400'>

                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <button onClick={addCandidate} className="text-sm rounded-md mt-3 bg-gray-50 text-gray-600 border-dashed border-[1px] border-gray-300 font-inter-regular lg:w-[500px] md:w-[400px] w-full h-[60px] flex items-center justify-center">
                        Add Candidate +
                    </button>
                    <button onClick={onSubmitForm} className={className(
                        "w-full lg:w-[500px] md:w-[400px] h-[30px] mt-3 flex justify-center items-center  rounded-md bg-white ring-1 ring-offset-2 right-[10px] top-[15px]"
                    )}>
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path></svg>
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
        return { props:{} }
    }


    return { props:{ session }  }
    
}
