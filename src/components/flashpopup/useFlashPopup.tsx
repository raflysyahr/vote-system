import { useContext } from "react";
import { FlashContext } from "./ProviderFlashPopup";


const useFlashPopup = ()=> useContext(FlashContext)


export default useFlashPopup
