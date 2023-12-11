import { NextApiRequest , NextApiResponse } from 'next';

import { prisma } from '@import/lib/prisma';
import { getSession } from 'next-auth/react';
import { omit } from 'lodash';

export default async function handleGetUser(req:NextApiRequest,res:NextApiResponse){
    

  if(req.method === 'GET'){
    const combinationData = [];
    const user = await prisma.user.findMany();
    for(let i = 0 ; i < user.length ; i++){
      const usr = user[i];
      const account = await prisma.account.findFirst({ where:{ userId:usr.id as string } })


      combinationData.push({...omit(usr,['password']),...omit(account,["userId","refresh_token","access_token","expires_at","token_type","scope","id_token"])})
    }

    res.status(200).json({ status:'OK',data:combinationData,message:'Get all user'});

  }

}
