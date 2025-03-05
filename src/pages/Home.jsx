import { useEffect } from 'react'
import { nomoFallbackQRCode } from "nomo-webon-kit"

function Home() {

  useEffect(() => {
    nomoFallbackQRCode()
  }, [])

  return (
      <div>Hello</div>
  )
}

export default Home