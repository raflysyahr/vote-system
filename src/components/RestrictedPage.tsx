import { useRouter  } from 'next/router';
import Head from 'next/head';

export default function RestrictedPage(){
  const router = useRouter();

  return (
      

        <div className="w-full h-screen bg-white flex items-center justify-center">
            <Head>
                <title> You not Authorization </title>
            </Head>
            <div className="w-[90%] lg:w-[90%] md:w-[80%] gap-4 flex flex-col items-center">
                <p className="font-inter-thin text-gray-900 text-center">You unauthorize in this page,please login/signup for access this page</p>
                <button 
                  onClick={()=> router.push('/auth/signin')}
                  className="font-inter-regular text-sm text-white bg-gray-800 w-[150px] h-[40px] flex items-center  justify-center">
                    Back to Login
                </button>
            </div>
        </div>
  
    

  )


}
