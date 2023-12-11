import { NextApiRequest , NextApiResponse } from 'next';
import { prisma } from "@import/lib/prisma";
import code from "@import/utils/random/code";
import { VoteType } from '@import/types/Vote';
import { getSession } from 'next-auth/react';

export default async function handle(req:NextApiRequest,res:NextApiResponse){
  const { title , startDateTime , endDateTime , publisher , candidates , scheduled  }:VoteType = req.body
  
  
  const session  = await getSession({req})
  
  const user = await prisma.user.findFirst({ where:{email:session?.user.email} })

  if(!user){
    res.status(404).json({
      status:'Not Authorize',
      data:null,
      message:'you not authorization , please login or signup',
    })
  }

  if(req.method === "POST" && user){

    const result = await prisma.votes.create({
        data:{
          title,
          startDateTime,
          endDateTime,
          publisher:user.name as string,
          email:user.email as string,
          candidates,
          scheduled:Boolean(scheduled),
          code:code(8),
        },
    });



    return res.status(200).json({ 
        status:'OK',
        data:result,
        message:'vote has been created'
    })

  }else{
    return res.status(404).json({ 
        status:'FAIL',
        data:null,
        message:`Method ${req.method} not support`
    })
  }




}
