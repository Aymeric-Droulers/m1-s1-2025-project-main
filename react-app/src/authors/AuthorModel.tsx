// src/authors/AuthorModel.tsx
export type AuthorModel = {
  id: string
  firstName: string
  lastName: string
  pictureUrl?: string
  booksCount: number
  averageSalesPerBook: number
}

export type CreateAuthorModel = {
  firstName: string
  lastName: string
  pictureUrl?: string
}

export type UpdateAuthorModel = Partial<CreateAuthorModel>
