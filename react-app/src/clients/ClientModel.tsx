import type { BookModel } from '../books/BookModel.tsx'

export type ClientModel = {
  id: string
  first_name: string
  last_name: string
  mail: string
  photo_link: string
  books_bought: BookModel[]
  nb_books_bought: number
}

export type CreateClientModel = {
  first_name: string
  last_name: string
  mail: string
  photo_link?: string
}

//types de useClientProvider
export type BookUpdatePayload = {
  title: string
  yearPublished: string
  description: string
  pictureUrl?: string
}
export type BookContextValue = {
  book: BookModel | null
  loading: boolean
  error: string | null
  saving: boolean
  apiError: string | null
  updateBook: (values: BookUpdatePayload) => Promise<void>
  clearApiError: () => void
}

export type UpdateClientModel = Partial<CreateClientModel>
