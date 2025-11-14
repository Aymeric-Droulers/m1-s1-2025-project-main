import { createFileRoute } from '@tanstack/react-router'
import { BookProvider } from '../books/providers/useBookDetailsProvider'
import { BookDetails } from '../books/components/BookDetails'

export const Route = createFileRoute('/books/$bookId')({
  component: BookDetailsRoute,
})

function BookDetailsRoute() {
  const { bookId } = Route.useParams()

  return (
    <BookProvider bookId={bookId}>
      <BookDetails />
    </BookProvider>
  )
}
