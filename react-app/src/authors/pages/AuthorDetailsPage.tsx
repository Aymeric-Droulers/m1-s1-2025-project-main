import { useAuthorDetailsProvider } from '../providers/useAuthorDetailsProvider'
import { useBookProvider } from '../../books/providers/useBookProvider'
import { Link } from '@tanstack/react-router'
import { Input, Button } from 'antd'
import { SafeImage } from '../../components/SafeImage'

interface AuthorDetailsPageProps {
  authorId: string
}

export function AuthorDetailsPage({ authorId }: AuthorDetailsPageProps) {
  const { author, loading, error, updateAuthor } =
    useAuthorDetailsProvider(authorId)
  const { books, loadBooks } = useBookProvider()

  // s'assurer que les livres sont chargés
  if (!books.length) {
    loadBooks()
  }

  if (loading || !author) {
    return <p>Chargement…</p>
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>
  }

  const booksByAuthor = books.filter(book => book.author.id === author.id)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const firstName = String(formData.get('firstName') ?? '')
    const lastName = String(formData.get('lastName') ?? '')
    const pictureUrl = String(formData.get('pictureUrl') ?? '')
    void updateAuthor({
      firstName,
      lastName,
      pictureUrl: pictureUrl || undefined,
    })
  }

  return (
    <div
      style={{
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h2>
        {author.firstName} {author.lastName}
      </h2>

      <SafeImage
        src={author.pictureUrl}
        size={120}
        style={{ marginBottom: '1rem' }}
      />

      <form onSubmit={onSubmit} style={{ maxWidth: '400px' }}>
        <label>Prénom</label>
        <Input
          name="firstName"
          defaultValue={author.firstName}
          style={{ marginBottom: '.5rem' }}
        />
        <label>Nom</label>
        <Input
          name="lastName"
          defaultValue={author.lastName}
          style={{ marginBottom: '.5rem' }}
        />
        <label>Photo (URL)</label>
        <Input
          name="pictureUrl"
          defaultValue={author.pictureUrl ?? ''}
          style={{ marginBottom: '.5rem' }}
        />
        <Button type="primary" htmlType="submit">
          Mettre à jour
        </Button>
      </form>

      <p style={{ marginTop: '1rem' }}>
        Nombre de livres : <b>{author.booksCount}</b>
      </p>
      <p>
        Nombre moyen de ventes : <b>{author.averageSalesPerBook.toFixed(2)}</b>
      </p>

      <h3 style={{ marginTop: '1rem' }}>Livres de cet auteur</h3>
      {booksByAuthor.length === 0 ? (
        <p>Aucun livre pour cet auteur.</p>
      ) : (
        <ul>
          {booksByAuthor.map(book => (
            <li key={book.id}>
              <Link to="/books/$bookId" params={{ bookId: book.id }}>
                {book.title} — {book.yearPublished}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
