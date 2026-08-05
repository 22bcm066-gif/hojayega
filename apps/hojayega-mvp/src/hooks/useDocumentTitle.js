import { useEffect } from 'react'

export function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title
    document.title = title ? `${title} | HoJayega` : 'HoJayega — Whatever it is. Ho Jayega.'
    return () => {
      document.title = previous
    }
  }, [title])
}
