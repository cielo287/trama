import { useEffect, useState } from 'react'

export function useTypewriter(text: string, speed = 30) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    let i = 0

    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++

      if (i >= text.length) clearInterval(interval)
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return displayed
}