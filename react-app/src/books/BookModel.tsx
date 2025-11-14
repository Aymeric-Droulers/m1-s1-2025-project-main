export type BookModel = {
  id: string
  title: string
  yearPublished: number
  description: string
  pictureUrl: string
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
}

export type UpdateBookModel = Partial<CreateBookModel>
