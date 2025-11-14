import { useState, useEffect, useCallback } from 'react'
import type { AuthorModel, UpdateAuthorModel } from '../AuthorModel'

export const useAuthorDetailsProvider = (authorId: string) => {
  const [author, setAuthor] = useState<AuthorModel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAuthor = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`http://localhost:3000/authors/${authorId}`)
      if (!res.ok) {
        throw new Error(`Auteur non trouvé (${res.status})`)
      }
      const data: AuthorModel = await res.json()
      setAuthor(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erreur lors du chargement de l’auteur',
      )
    } finally {
      setLoading(false)
    }
  }, [authorId])

  useEffect(() => {
    void loadAuthor()
  }, [loadAuthor])

  const updateAuthor = async (input: UpdateAuthorModel) => {
    const res = await fetch(`http://localhost:3000/authors/${authorId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    if (!res.ok) {
      throw new Error('Erreur lors de la mise à jour de l’auteur')
    }
    await loadAuthor()
  }

  return { author, loading, error, reload: loadAuthor, updateAuthor }
}
