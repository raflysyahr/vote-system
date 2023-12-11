import { ChangeEvent, useState } from "react"


type InputType = {
    type:"text"|"email"|"password"|"number",
    valueChange:(value:string)=> void,
    placeholder:string,
    value?:string|number
}

export default function Input(props:InputType){
    const [defaultVal,setDefaultVal] = useState<string>('');

    const change = (event:ChangeEvent<HTMLInputElement>)=>{
        setDefaultVal(event.target.value)
        props.valueChange(event.target.value)
    }

    return <input defaultValue={defaultVal} className="w-full h-full focus:outline-none" type={props.type} onChange={change} placeholder={props.placeholder} />
}