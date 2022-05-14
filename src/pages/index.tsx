import { Button } from '@mui/material'
import { PublicLayout } from 'layouts'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const { push } = useRouter()
  return (
    <PublicLayout>
      <main>
        <Button onClick={() => push('/login')}>Login</Button>
      </main>
    </PublicLayout>
  )
}

export default Home
