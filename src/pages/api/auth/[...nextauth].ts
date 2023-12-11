import NextAuth from 'next-auth';
import ProviderCredentials from 'next-auth/providers/credentials';
import { prisma } from '@import/lib/prisma'
import { WarningCode } from 'next-auth/utils/logger';
import { omit } from 'lodash';
import { customRandom , random } from '@import/utils/random/number';
import { AdapterAccount, AdapterUser , Adapter  } from 'next-auth/adapters';
import CryptoJS from 'crypto-js';
import { account , user } from '@prisma/client';
import { randomUUID } from 'crypto';
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from '@next-auth/prisma-adapter';
// import {PrismaAdapter} from '../../../lib/prisma-adapter/index.js'

export default NextAuth({
  debug:true,
  providers:[
    GoogleProvider({
        clientId:String(process.env.GOOGLE_ID),
        clientSecret:String(process.env.GOOGLE_SECRET)
    })],
  secret:process.env.SECRET_KEY,
  adapter:PrismaAdapter(prisma),
  pages:{
    signIn:'/auth/signin',
    error:'/auth/error',
    newUser:'/introduction',
    verifyRequest:'/auth/email/verification'
  },
  callbacks:{
       async signIn({ user , account , profile , email , credentials }) {
          return true
      }
      ,
      async session({ session , token , user  }){
          return session 
      },
      async redirect({ url , baseUrl }) {
          return url || baseUrl
      },
      async jwt({ token , user , account , profile , isNewUser }){
        return token
      }

  },
  logger:{
    error:((code,metadata: Error | {
      error: Error;
      [key: string]: unknown;
    })=> console.error(code,metadata)),
    warn:((code:WarningCode)=> console.warn(code)),
    debug:((code:string,metadata:unknown)=> console.log(code,metadata))
  },
  session:{ 
    strategy:'jwt'
  }
})
