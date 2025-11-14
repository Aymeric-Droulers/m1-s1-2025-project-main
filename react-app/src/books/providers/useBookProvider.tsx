import { useState } from 'react'
import type { BookModel, CreateBookModel, UpdateBookModel } from '../BookModel'
import axios from 'axios'

// type des objets renvoyés par /clients/byBook/:bookId
type ClientBookPurchase = {
  id: string
  first_name: string
  last_name: string
  mail: string
  photo_link: string
  books_bought: string[]
  nb_books_bought: number
}

export const useBookProvider = () => {
  const [books, setBooks] = useState<BookModel[]>([])

  const loadBooks = async () => {
    try {
      const res = await axios.get('http://localhost:3000/books')

      const payload = res.data
      const list =
        Array.isArray(payload)
          ? payload
          : payload.books ?? payload.items ?? payload.data ?? []

      // pour chaque livre, on va chercher les ventes
      const booksWithSales = await Promise.all(
        (list as BookModel[]).map(async book => {
          try {
            const clientsRes = await axios.get<ClientBookPurchase[]>(
              `http://localhost:3000/clients/byBook/${book.id}`,
            )

            const clients = clientsRes.data || []

            // total d'exemplaires vendus = somme de nb_books_bought
            const soldCount = clients.reduce(
              (sum, c) => sum + (c.nb_books_bought ?? 0),
              0,
            )

            return { ...book, soldCount }
          } catch (err) {
            console.error(
              'Erreur lors du chargement des ventes pour le livre',
              book.id,
              err,
            )
            // en cas d'erreur sur l’endpoint des ventes, on garde le livre mais avec 0
            return { ...book, soldCount: 0 }
          }
        }),
      )

      setBooks(booksWithSales)
    } catch (err) {
      console.error(err)
      setBooks([]) // fail safe
    }
  }

  const createBook = async (book: CreateBookModel) => {
    try {
      await axios.post('http://localhost:3000/books', book)
      await loadBooks()
    } catch (err) {
      console.error(err)
    }
  }

  const updateBook = async (id: string, input: UpdateBookModel) => {
    try {
      await axios.patch(`http://localhost:3000/books/${id}`, input)
      await loadBooks()
    } catch (err) {
      console.error(err)
    }
  }

  const deleteBook = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/books/${id}`)
      await loadBooks()
    } catch (err) {
      console.error(err)
    }
  }

  return { books, loadBooks, createBook, updateBook, deleteBook }
}
