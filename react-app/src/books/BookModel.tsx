export type BookModel = {
  id: string
  title: string
  yearPublished: number
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

export type UpdateBookModel = Partial<CreateBookModel>
