import { NextApiRequest , NextApiResponse } from 'next';

import { prisma } from '@import/lib/prisma';
import { getSession } from 'next-auth/react';
import { omit } from 'lodash';

export default async function handleGetUser(req:NextApiRequest,res:NextApiResponse){
  const session = await getSession({req});
  const { username } = req.body

  if(req.method === 'PUT'){

    const updateUsername = await prisma.user.update({
      where:{
        email:session?.user.email as string
      },
      data:{
        username:username as string
      }
    })

    res.status(200).json({ status:'OK',data:updateUsername,message:'updated username'});

  }

}
