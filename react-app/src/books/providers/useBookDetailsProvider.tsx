import { useState, useCallback } from 'react'
import type { BookModel } from '../BookModel'

export const useBookDetailsProvider = (id: string) => {
  const [isLoading, setIsLoading] = useState(false)
  const [book, setBook] = useState<BookModel | null>(null)

  const loadBook = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`http://localhost:3000/books/${id}`)
      const data: BookModel = await res.json()
      setBook(data)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  return { isLoading, book, loadBook }
}
