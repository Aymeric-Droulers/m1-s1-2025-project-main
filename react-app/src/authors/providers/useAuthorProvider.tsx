import { useState, useCallback } from 'react'
import axios from 'axios'
import type {
  AuthorModel,
  CreateAuthorModel,
  UpdateAuthorModel,
} from '../AuthorModel'

export const useAuthorProvider = () => {
  const [authors, setAuthors] = useState<AuthorModel[]>([])

  const loadAuthors = useCallback(() => {
    axios
      .get('http://localhost:3000/authors')
      .then(res => {
        const payload = res.data
        const list = Array.isArray(payload)
          ? payload
          : (payload.authors ?? payload.items ?? payload.data ?? [])
        setAuthors(list as AuthorModel[])
      })
      .catch(err => console.error(err))
  }, [])

  const createAuthor = (input: CreateAuthorModel) => {
    return axios
      .post('http://localhost:3000/authors', input)
      .then(() => {
        loadAuthors()
      })
      .catch(err => console.error(err))
  }

  const updateAuthor = (id: string, input: UpdateAuthorModel) => {
    return axios
      .patch(`http://localhost:3000/authors/${id}`, input)
      .then(() => {
        loadAuthors()
      })
      .catch(err => console.error(err))
  }

  const deleteAuthor = (id: string) => {
    return axios
      .delete(`http://localhost:3000/authors/${id}`)
      .then(() => {
        loadAuthors()
      })
      .catch(err => console.error(err))
  }

  return { authors, loadAuthors, createAuthor, updateAuthor, deleteAuthor }
}
