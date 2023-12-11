import { NextApiRequest , NextApiResponse } from 'next';
import { prisma } from '@import/lib/prisma';
import { getSession } from 'next-auth/react';
import { omit } from 'lodash';

type bodyPutType = {
  username:string|null,
  name:string|null,
  dateofbirth:string|null
}


export default async function handleEditUser(
  req:NextApiRequest,
  res:NextApiResponse){

  const session = await getSession({req});

  if(req.method === 'PUT'){

    try{
      const { username , name , dateofbirth }:bodyPutType = req.body


      const result = await prisma.user.update({
          where:{ email : session?.user?.email as string },
          data:{
            username:username as string,
            name:name as string
          },
          include:{
            session:true,
            account:true
          }
      })


      res.status(200).json({ status:'OK', data:omit(result,['password']), message:'Get user info' })
    }catch(error){
      res.status(200).json({ status:'ERROR', data:null, message:'Server have a somthing error!'})
    }
  }else{
    res.status(404).json({ status:'FAILED', data:null, message:`Method ${req.method} not allowed/include in request`})
  }
}
