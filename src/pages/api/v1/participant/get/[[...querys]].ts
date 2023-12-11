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
  
  const [ code , me , email ]: any[
    string
  ] | undefined = req.query.querys

  const session = await getSession({req})
  

//  if(!session){ 
//      res.send(405).json({
//          status:'NOT_AUTHORIZE',
//          data:null,
//          message:'You not authorize for accesed'
//      })
//  }

  if(req.method === 'GET'){
 
    if(Boolean(me)){

      const getParticipantBy = await prisma.participant.findFirst({
        where:{
          code:code as string,
          email:email as string
        }
      })



      res.status(200).json({
        status:'OK',
        data:getParticipantBy,
        message:'Participant by email'
      })

    }else{
      const getParticipantBy = await prisma.participant.findMany({
        where:{
          code:code as string
        }
      })

      res.status(200).json({
        status:'OK',
        data:getParticipantBy,
        message:'Participant by code'
      })
    }
  }
}
