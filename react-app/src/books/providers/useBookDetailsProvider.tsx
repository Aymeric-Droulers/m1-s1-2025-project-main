import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'
import axios from 'axios'
import type { ReactNode } from 'react'
import type {
  BookModel,
  BookUpdatePayload,
  BookContextValue,
  PurchaseModel,
} from '../BookModel'

const BookContext = createContext<BookContextValue | undefined>(undefined)

type BookProviderProps = {
  bookId: string
  children: ReactNode
}

export function BookProvider({ bookId, children }: BookProviderProps) {
  const [book, setBook] = useState<BookModel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const fetchBook = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [bookRes, clientsRes] = await Promise.all([
        fetch(`http://localhost:3000/books/${bookId}`),
        fetch(`http://localhost:3000/clients/byBook/${bookId}`),
      ])

      if (!bookRes.ok) {
        throw new Error(`Livre non trouvé (${bookRes.status})`)
      }
      if (!clientsRes.ok) {
        throw new Error(
          `Erreur lors du chargement des clients (${clientsRes.status})`,
        )
      }

      const bookData = await bookRes.json()
      const clientsData = await clientsRes.json()
      //setBook(data)
      setBook({
        ...bookData,
        achats: clientsData,
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erreur lors du chargement du livre',
      )
    } finally {
      setLoading(false)
    }
  }, [bookId])

  useEffect(() => {
    fetchBook()
  }, [fetchBook])

  const updateBook = useCallback(
    async (values: BookUpdatePayload) => {
      setSaving(true)
      setApiError(null)

      try {
        const payload = {
          title: values.title,
          yearPublished: values.yearPublished,
          description: values.description,
          pictureUrl: values.pictureUrl || '',
        }

        const res = await fetch(`http://localhost:3000/books/${bookId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          let errorMessage = `Erreur ${res.status}`
          try {
            const errorText = await res.text()
            errorMessage += `: ${errorText}`
          } catch {
            errorMessage += `: ${res.statusText}`
          }
          throw new Error(errorMessage)
        }

        // Recharger les données après la modification
        await fetchBook()
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erreur inconnue'
        setApiError(errorMessage)
        throw err // on laisse le composant décider quoi faire (message, etc.)
      } finally {
        setSaving(false)
      }
    },
    [bookId, fetchBook],
  )

  const purchaseBook = useCallback(async (payload: PurchaseModel) => {
    console.log("Détails de l'achat:", payload)
    try {
      const response = await axios.post(
        'http://localhost:3000/clients/buyBook',
        payload,
      )
      console.log("Réponse de l'API:", response)
      await fetchBook() //on recharge les acheteurs
    } catch (err) {
      console.error("Erreur lors de l'achat:", err)
    }
  }, [])

  const clearApiError = () => setApiError(null)

  const value: BookContextValue = {
    book,
    loading,
    error,
    saving,
    apiError,
    updateBook,
    clearApiError,
    purchaseBook,
  }

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>
}

export function useBook() {
  const ctx = useContext(BookContext)
  if (!ctx) {
    throw new Error('useBook doit être utilisé dans un BookProvider')
  }
  return ctx
}
