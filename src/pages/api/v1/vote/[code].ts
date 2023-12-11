import { NextApiRequest , NextApiResponse } from 'next';
import { prisma } from '@import/lib/prisma';
import code from '@import/utils/random/code';
import { VoteType } from '@import/types/Vote';
import { Candidate } from '@import/types/Candidate';




export default async function handle(req:NextApiRequest,res:NextApiResponse){
  
  const { code } = req.query



  if(req.method === 'GET'){

   

      const query = await prisma.votes.findFirst({
         where:{ code : code as string  },
         include:{ participant : true}
      })

      if(query){
        let totalyParticipant = 0;

        const votesResult:Candidate[] = []

        for(let i = 0 ; i < query.candidates.length;i++){
          const candidate:Candidate = query.candidates[i];
          const participant = await prisma.participant.findMany({
            where:{
              code:code as string,
              idcandidate:candidate.id
            }
          })

          totalyParticipant = totalyParticipant + participant.length
          candidate.votes = participant.length

          votesResult.push(candidate)
        }


        return res.status(200).json({
          status:'OK',
          data:{...query , candidates:[...votesResult],total:totalyParticipant},
          message:`Your get votes by ${code}`
        })
      }else{
        return res.status(204).json({
          status:'OK',
          data:null,
          message:`Votes by ${code} is not found`
        })
      }

      
  } else if(req.method === 'DELETE'){

    const deleteVote = await prisma.votes.delete({
      where:{ code : code as string  }
    })

    return res.status(200).json({
      status:'OK',
      data:deleteVote,
      message:`Vote has been deleted by code ${code}`
    })

  } else if(req.method === 'PUT'){

    const exists = await prisma.votes.findFirst({where:{ code: code as string }})
    if(exists){
      

      const update  = await prisma.votes.update({
        where:{ code: code as string },
        data:{
          title: req.body.title as string || exists.title,
          startDateTime:req.body.startDateTime as Date || exists.startDateTime,
          endDateTime:req.body.endDateTime as Date || exists.endDateTime,
          scheduled:Boolean(req.body.scheduled || exists.scheduled),
          publisher:req.body.publisher as string || exists.publisher
        }
      })

      return res.status(200).json({
        status:'OK',
        data:update,
        message:`Vote has been updated by code ${code}`
      })

    }else{
      return res.status(200).json({ 
          status:'OK',
          data:null,
          message:`Data vote is not found`
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
