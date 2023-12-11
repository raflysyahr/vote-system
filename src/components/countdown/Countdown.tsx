import { useState , useEffect } from 'react';
import CountDown , { CountdownRendererFn  } from "react-countdown";
import CountItem from '@import/components/countdown/CountItem';
import moment from 'moment';


type propsCountdownType = {
  start:Date,
  end:Date,
  countdownState:(value:string)=> void,
  numberSize?:string,
  labelSize?:string,
  spacing?:string
}

type countStateType = "NOT_START" | "START" | "ENDED"

export default function Countdown(props:propsCountdownType){
  const [COUNT_STATE,SETCOUNT_STATE] = useState<countStateType>('NOT_START');

  useEffect(()=>{
    const start = moment(props.start);
    const end = moment(props.end);


        const now = moment();
        
        if(now.isBefore(start)){

          SETCOUNT_STATE('NOT_START')
          props.countdownState('NOT_START')

        }else if(now.isAfter(start) && now.isBefore(end)){

          SETCOUNT_STATE('START')
          props.countdownState('START')

        }else if(now.isAfter(end)){

          SETCOUNT_STATE('ENDED')
          props.countdownState('ENDED')

        }




    return ()=> {}

  },[])

  const countdown:CountdownRendererFn = ({ days , hours , minutes , seconds , completed})=>  {
    
    if(completed) {
        if(COUNT_STATE === 'NOT_START' ){
            SETCOUNT_STATE('START')
            props.countdownState('START')
        }else if(COUNT_STATE === 'START'){
            SETCOUNT_STATE('ENDED')
            props.countdownState('ENDED')
        }
    }

    return (
     <div className="flex  items-center gap-2">
        <CountItem spacing={props.spacing} numberSize={props.numberSize} labelSize={props.labelSize}  label="day" value={days} />      
        <CountItem spacing={props.spacing} numberSize={props.numberSize} labelSize={props.labelSize} label="hr" value={hours} />
        <CountItem spacing={props.spacing} numberSize={props.numberSize} labelSize={props.labelSize} label="min" value={minutes} />
        <CountItem spacing={props.spacing} numberSize={props.numberSize} labelSize={props.labelSize} label="sec" value={seconds} />
     </div>
    ) 
  }

  return (
      <div className="flex flex-col mt-3">
        {
          COUNT_STATE === 'NOT_START' &&
            <div className="w-full ">
              <small className="w-full flex justify-center font-inter-regular text-gray-400 mb-2">start vote until:</small>
              <CountDown date={props.start} renderer={countdown} />
            </div>
        }
        {
          COUNT_STATE === 'START' &&
            <div className="w-full">
                <small className="w-full flex justify-center font-inter-regular text-gray-400 mb-2">vote ended until:</small>
                <CountDown date={props.end} renderer={countdown} />
            </div>
        }
        {
          COUNT_STATE === 'ENDED' && 
            <div className="w-full">
                <small className="w-full flex justify-center font-inter-regular text-gray-400 mb-2">
                    voting is ended
                </small>
            </div>
        }

      </div>
  )


}
