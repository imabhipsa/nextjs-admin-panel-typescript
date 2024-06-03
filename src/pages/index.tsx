import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default () => {
  const { push } = useRouter()
  useEffect(() => {
    ;(() => {
      return push('/admin')
    })()
  }, [])
  return <></>
}
