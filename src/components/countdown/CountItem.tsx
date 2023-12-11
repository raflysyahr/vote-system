import { zeroPad } from 'react-countdown';

type PropsCountItem = {
  label:string,
  value:number,
  numberSize?:string,
  labelSize?:string,
  spacing?:string
}

const toLowerCase = (str:string)=> str.toLocaleLowerCase()

export default function CountItem(props:PropsCountItem){

  
  return (
    <div className="flex items-center justify-center w-[60px]">
        <div className="flex flex-col items-center w-[60px]">
          <div className="flex relative">
           <p className={`font-inter-exbold text-gray-500 ${ props.numberSize ? props.numberSize :"text-2xl"}`}>{zeroPad(props.value,2)}</p>
           <span className="text-2xl absolute right-[-20px]"> {toLowerCase(props.label as string) !== 'sec' && ":" }</span>
          </div> 
           <small className={`font-inter-regular ${ props.labelSize ? props.labelSize :"text-sm"}`}>{props.label}</small>
        </div>
        
    </div>
  
  )

}
