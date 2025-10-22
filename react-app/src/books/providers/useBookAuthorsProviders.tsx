import { useState } from 'react'
import type { BookModel } from '../BookModel'
import axios from 'axios'

export const useBookAuthorsProviders = () => {
  const [authors, setAuthors] = useState<BookModel['author'][]>([])

  const loadAuthors = () => {
    axios
      .get('http://localhost:3000/authors')
      .then(data => {
        setAuthors(data.data)
      })
      .catch(err => console.error(err))
  }

  return { authors, loadAuthors }
}
