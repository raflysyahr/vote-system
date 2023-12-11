import { NextApiRequest , NextApiResponse } from 'next';

import { prisma } from '@import/lib/prisma';
import { getSession } from 'next-auth/react';
import { omit } from 'lodash';

export default async function handleGetUser(req:NextApiRequest,res:NextApiResponse){
    



  if(req.method === 'PUT'){

    const f = await prisma.user.findFirst({ where:{ email: req.body.email as string }})
    if(f){
      const update = await prisma.user.update({
        where:{ email:f.email  as string },
        data:{
          emailVerified:new Date()
        },
        include:{
          session:true,
          account:true
        }
      })


      res.status(200).json({ status:'OK',data:update,message:'update verificatoin email'});  
    }else{
      res.status(200).json({ status:'OK',data:null,message:'user not found'});  
    }
    
  }

}
