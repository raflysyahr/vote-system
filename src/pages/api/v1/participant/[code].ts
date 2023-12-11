import { NextApiRequest , NextApiResponse  } from 'next';
import { prisma } from '@import/lib/prisma';
import { Candidate } from '@import/types/Candidate';
import { VoteType } from '@import/types/Vote';
import { getSession } from 'next-auth/react';

type participantType = {
  email:string,
  name:string,
  code:string,
  idcandidate:string
}

export default async function handle(req:NextApiRequest,res:NextApiResponse){
  
  const { code } = req.query

  const session = await getSession({req})

  const user_found = await prisma.user.findFirst({ where:{ email:session?.user.email } })

  if(req.method === 'POST'){

    if(user_found){
    
      const { email , idcandidate }:participantType = req.body

      const findManyParticipant = await prisma.participant.findMany({
          where:{
              email:session?.user.email as string
          }
      })

      const findParticipant = findManyParticipant.find((e,i,a)=> e.code === code as string)

      const findVote = await prisma.votes.findFirst({
          where:{ code : code as string}
      })  


      if(!findParticipant && findVote){

          const create = await prisma.participant.create({
            data:{
              email:session?.user.email as string,
              code:code as string,
              idcandidate,
              votesId:findVote.id
            }
          })

          const vote_ = findVote
          const candidates:Candidate[] = [];
          let totalyParticipant = 0;

          for(let i = 0 ; i < vote_.candidates.length;i++){
             const candidate:Candidate = vote_.candidates[i] 
             const participant = await prisma.participant.findMany({
                where:{
                  code:code as string,
                  idcandidate:candidate.id
                }
             })

            totalyParticipant = totalyParticipant + participant.length
            candidate.votes = participant.length;

            candidates.push(candidate)
          }
        

          return res.status(200).json({
              status:'OK',
              data:{ ...vote_,candidates:candidates,total:totalyParticipant },
              message:'Successful voting'

          })

      }else{
          return res.status(404).json({
             status:'FAILED',
              data: null ,
              message:'You have a submitted vote'//'You has been found after voting'
          })
      }
    }else{
      return res.status(200).json({
          status:'FAILED',
          data:null,
          message:'account is not in the database, please logout and login again'
      })
    }

  
  }else if(req.method === 'GET'){
      const result = await prisma.participant.findMany({ where:{ code : code as string}})
      return res.status(200).json({
        status:'OK',
        data:result,
        message:'Getting voting by code '+ code
      })
  }
}
