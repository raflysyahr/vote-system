import { NextApiRequest , NextApiResponse } from 'next';

import { prisma } from '@import/lib/prisma';
import { getSession } from 'next-auth/react';
import { omit } from 'lodash';

export default async function handleGetUser(req:NextApiRequest,res:NextApiResponse){
    
  const { username } = req.query

  if(req.method === 'GET'){
    const users = await prisma.user.findMany();
    const istaken = users.find((e,i,a)=> e.username === username as string)
    res.status(200).json({ status:'OK',data:istaken ? true : false,message:'get username status taken'});

  }

}
