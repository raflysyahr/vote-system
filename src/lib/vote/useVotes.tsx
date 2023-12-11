import useSWR from 'swr';
import axios from 'axios';
import { VoteType } from "@import/types/Vote";

type resultType = {
  status:string,
  data:VoteType[]|null,
  message:string
}

export default function useVotes(){
  const fetcher = (url:string)=> axios.get(url).then((r)=> r.data)
  const { data , error  } = useSWR<resultType|null>(`/api/v1/vote`,fetcher)
  

  return {
    data , error , isLoading: !error && !data
  }
}

