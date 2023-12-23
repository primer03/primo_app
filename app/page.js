import Head from 'next/head'
import SelectChanel from '@/components/SelectChanel'
import { io } from 'socket.io-client'
export const metadata = {
  title: 'Message Board',
  description: 'My page description',
}
export default function Home() {
  
  return (
    <div>
      <Head>
        <title>My page title</title>
        <meta property="og:title" content="My page title" key="title" />
      </Head>
      <SelectChanel />
    </div>
  )
}
