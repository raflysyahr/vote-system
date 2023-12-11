import { SyntheticEvent , useState } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

export type propsDatePickType = {
  changeValue:(value:Date|null)=> void
}


export default function DatePick(props:propsDatePickType){

    const [selectedDate,setSelectedDate] = useState<Date|null>(new Date());

    const onSelectDate = (date:Date,event:SyntheticEvent<any,Event>|undefined):void=> {
      setSelectedDate(date)
      props.changeValue(date)
    }
  
    const onChangeDate = (date:Date|null,event:SyntheticEvent<any,Event>):void=> {
      setSelectedDate(date)
      props.changeValue(date)
    }


    return (
        <div className="lg:w-[200px] md:w-[200px] w-full overflow-hidden flex items-center justify-center rounded-md px-2 font-inter-regular h-[40px] border-[1px] border-gray-100">
          <DatePicker 
          className="outline-none focus:outline-none"
          selected={selectedDate} 
          onSelect={onSelectDate}
          onChange={onChangeDate} />
        </div>
    )
}
