import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@import/lib/prisma';
import { omit } from 'lodash';
import { getSession } from 'next-auth/react';
export default async function handle(req:NextApiRequest,res:NextApiResponse){

    const session = await getSession({req})


    if(req.method === 'GET'){
        const find = await prisma.user.findFirst({
            where:{
                email:req.query?.email as string
            },
            include:{
                session:true,
                account:true
            }
        })


        if(find){
            const account = await prisma.account.findFirst({ where:{ userId:find.id as string } })
            res.status(200).json({
                status:"OK",
                data:{...omit(find,['password']),...omit({...account},['id','password',"userId","refresh_token","access_token","expires_at","token_type","scope","id_token"])},
                message:'Get user info'
            })
        }else{
            res.status(200).json({
                status:"OK",
                data:null,
                message:'Get user info'
            })
        }

       
    
    }
}