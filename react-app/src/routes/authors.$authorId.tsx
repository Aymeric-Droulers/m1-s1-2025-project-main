import { createFileRoute } from '@tanstack/react-router'
import { AuthorDetailsPage } from '../authors/pages/AuthorDetailsPage'

export const Route = createFileRoute('/authors/$authorId')({
  component: AuthorDetailsRouteComponent,
})

function AuthorDetailsRouteComponent() {
  const { authorId } = Route.useParams()
  return <AuthorDetailsPage authorId={authorId} />
}
