import { createContext, ReactNode, useContext, useState , useEffect } from 'react';

type optionFlashPopup = {
    timer?:number,
    text?:string,
    html?: JSX.Element
}
const className = (...classess:any[])=> classess.filter(Boolean).join(' ');

type contextType = {
    show:boolean,
    showFlashPopup:(data:optionFlashPopup)=> void
}

let initializeContext = {
  show:false,
  showFlashPopup:(option:optionFlashPopup) => {}
}

export const FlashContext = createContext<contextType>(initializeContext);


export default function ProviderFlashPopup({ children }:{ children:ReactNode }){

    const [flashPopup,setFlashPopup] = useState<boolean>(false);
    const [show,setShow] = useState<boolean>(false);
    const [text,setText] = useState<string|null>(null);
    const [html,setHtml] = useState<JSX.Element|null>(null)

    const showFlashPopup = (option:optionFlashPopup)=> {
        
        option?.text ? setText(option?.text as string) : setHtml(option?.html as JSX.Element)


        setFlashPopup(true)
        setShow(true)

        setTimeout(()=>{
            setFlashPopup(false)
            setTimeout(()=> setShow(false), 100);
            setTimeout(()=> { setText('') },1500)
            
        },option?.timer as number)
    };




    return (
        <>
            <FlashContext.Provider value={{
                show:flashPopup,
                showFlashPopup:(option:optionFlashPopup)=> showFlashPopup(option)
                }} >
                {children}
            </FlashContext.Provider>
            {
                show &&
                    <div 
                    style={{ 
                        bottom:flashPopup ? '40px' : '-100px'
                    }}
                    className={
                        className(
                            "absolute duration-700 z-[999] min-w-[250px] flex justify-center items-center h-[40px]",
                            "translate-x-[-50%] left-[50%]",
                            "bg-white shadow-sm rounded-sm border-l-[2px] border-green-500"
                        )
                    }> 
                        {text || html}
                    </div>
            }
        </>
    )
}
