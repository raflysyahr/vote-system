import '@import/styles/globals.css'
import { SessionProvider } from "next-auth/react"
import type { AppProps } from 'next/app'
import type { Session } from 'next-auth'
import ProviderFlashPopup from '@import/components/flashpopup/ProviderFlashPopup';


export default function App({ Component, pageProps , session }: AppProps&{ session : Session}) {
  return ( 
    <SessionProvider session={session}>
       <ProviderFlashPopup>
          <Component {...pageProps} />
        </ProviderFlashPopup>
    </SessionProvider>
  )
}
