import { createFileRoute } from '@tanstack/react-router'
import { BooksPage } from '../../books/pages/BooksPage'

export const Route = createFileRoute('/books/')({
  component: BooksPage,
})
