import { VoteType } from '@import/types/Vote'
import useSWR from 'swr';
import axios from 'axios';

type resultType = {
  status:string,
  data:VoteType|null,
  message:string
}


export default function useVote(code?:string){
  const fetcher = (url:string)=> axios.get(url).then((r)=> r.data)
  const { data , error  } = useSWR<resultType|null>(`/api/v1/vote/${code}`,fetcher)
  

  return {
    data , error , isLoading: !error && !data
  }
}

