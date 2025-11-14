import type { ClientModel } from '../clients/ClientModel.tsx'

export type BookModel = {
  photo_link: string
  id: string
  title: string
  yearPublished: number
  description: string
  pictureUrl: string
  achats: ClientModel[]
  author: {
    id: string
    firstName: string
    lastName: string
  }
}

export type CreateBookModel = {
  authorId: string
  title: string
  yearPublished: number
}

//type de useBookPurshaseProvider
export type PurchaseModel = {
  clientId: string
  bookId: string
  date: number
}

//types de useBookProvider
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
  purchaseBook: (payload: PurchaseModel) => Promise<void>
}

export type UpdateBookModel = Partial<CreateBookModel>
