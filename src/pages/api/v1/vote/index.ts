import { NextApiRequest , NextApiResponse } from 'next';
import { prisma } from "@import/lib/prisma";
import { Candidate } from '@import/types/Candidate';
import { VoteType } from '@import/types/Vote';
import { getSession } from 'next-auth/react';


export default async function handle(req:NextApiRequest,res:NextApiResponse){

  const session = await getSession({req})

  const { code }  = req.query


  if(req.method === "GET"){

  
    const result = await prisma.votes.findMany({
      where:{
        email:session?.user?.email as string
      }
    })

      if(result){
        
        const votesResult:VoteType[] = [];

        for(let r = 0 ; r < result.length;r++){
          const vote:VoteType = result[r];

          let totalyParticipant = 0;
  
          const voteCandidate:Candidate[] = []
  
          for(let i = 0 ; i < vote.candidates.length;i++){
            const candidate:Candidate = vote.candidates[i];
            const participant = await prisma.participant.findMany({
              where:{
                code:code as string,
                idcandidate:candidate.id
              }
            })
  
            totalyParticipant = totalyParticipant + participant.length
            candidate.votes = participant.length
  
            voteCandidate.push(candidate)
          }

          vote.candidates = voteCandidate;
          vote.total = totalyParticipant

          votesResult.push(vote)

        }

        return res.status(200).json({ 
          status:'OK',
          data:votesResult,
          message:'get all votes'
      })
      }
    
  
    

  }else{
    return res.status(404).json({ 
        status:'FAIL',
        data:null,
        message:`Method ${req.method} not support`
    })
  }



}
