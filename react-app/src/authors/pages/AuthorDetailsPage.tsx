import { useEffect } from 'react'
import { useAuthorDetailsProvider } from '../providers/useAuthorDetailsProvider'
import { useBookProvider } from '../../books/providers/useBookProvider'
import { Link } from '@tanstack/react-router'
import {
  Card,
  Form,
  Input,
  Button,
  Spin,
  Alert,
  Typography,
  message,
} from 'antd'
import { SafeImage } from '../../components/SafeImage'

const { Title, Text } = Typography

interface AuthorDetailsPageProps {
  authorId: string
}

type AuthorFormValues = {
  firstName: string
  lastName: string
  pictureUrl?: string
}

export function AuthorDetailsPage({ authorId }: AuthorDetailsPageProps) {
  const { author, loading, error, updateAuthor } =
    useAuthorDetailsProvider(authorId)
  const { books, loadBooks } = useBookProvider()
  const [form] = Form.useForm<AuthorFormValues>()

  // Charger les livres s'ils ne sont pas encore récupérés
  useEffect(() => {
    if (!books.length) {
      loadBooks()
    }
  }, [books.length, loadBooks])

  // Remplir le formulaire lorsque l'auteur est chargé
  useEffect(() => {
    if (author) {
      form.setFieldsValue({
        firstName: author.firstName,
        lastName: author.lastName,
        pictureUrl: author.pictureUrl ?? '',
      })
    }
  }, [author, form])

  if (loading && !author) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '2rem',
        }}
      >
        <Spin size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ maxWidth: 800, margin: '24px auto', padding: '0 16px' }}>
        <Alert
          type="error"
          message="Erreur lors du chargement de l’auteur"
          description={error}
        />
      </div>
    )
  }

  if (!author) {
    return (
      <div style={{ maxWidth: 800, margin: '24px auto', padding: '0 16px' }}>
        <Alert
          type="warning"
          message="Auteur introuvable"
          description="L’auteur demandé n’existe pas."
        />
      </div>
    )
  }

  const booksByAuthor = books.filter(book => book.author.id === author.id)

  const handleSave = async (values: AuthorFormValues) => {
    try {
      await updateAuthor({
        firstName: values.firstName,
        lastName: values.lastName,
        pictureUrl: values.pictureUrl || undefined,
      })
      message.success('Auteur mis à jour avec succès')
    } catch (e) {
      message.error("Erreur lors de la mise à jour de l'auteur", e)
    }
  }

  return (
    <div
      style={{
        maxWidth: 800,
        margin: '24px auto',
        padding: '0 16px',
      }}
    >
      <Card>
        {/* En-tête avec image + infos */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '16px',
            alignItems: 'center',
          }}
        >
          <SafeImage src={author.pictureUrl} size={100} />
          <div style={{ flex: 1 }}>
            <Title level={3} style={{ marginBottom: 0 }}>
              {author.firstName} {author.lastName}
            </Title>
            <Text type="secondary">Auteur</Text>

            <div style={{ marginTop: '12px' }}>
              <div>
                <Text>Nombre de livres : </Text>
                <Text strong>{author.booksCount}</Text>
              </div>
              <div>
                <Text>Nombre moyen de ventes : </Text>
                <Text strong>{author.averageSalesPerBook.toFixed(2)}</Text>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire de mise à jour */}
        <Form<AuthorFormValues>
          form={form}
          layout="vertical"
          onFinish={handleSave}
          autoComplete="off"
        >
          <Form.Item
            label="Prénom"
            name="firstName"
            rules={[{ required: true, message: 'Veuillez saisir le prénom' }]}
          >
            <Input placeholder="Prénom" />
          </Form.Item>

          <Form.Item
            label="Nom"
            name="lastName"
            rules={[{ required: true, message: 'Veuillez saisir le nom' }]}
          >
            <Input placeholder="Nom" />
          </Form.Item>

          <Form.Item label="URL de la photo" name="pictureUrl">
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Enregistrer les modifications
            </Button>
          </Form.Item>
        </Form>

        {/* Liste des livres de l'auteur */}
        <div style={{ marginTop: '24px' }}>
          <Title level={4} style={{ marginBottom: '8px' }}>
            Livres de cet auteur
          </Title>

          {booksByAuthor.length === 0 ? (
            <Text type="secondary">Aucun livre pour cet auteur.</Text>
          ) : (
            <ul style={{ paddingLeft: '16px' }}>
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

        {/* Boutons bas de page (comme BookDetails) */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '24px',
          }}
        >
          <Button
            onClick={() => {
              window.history.back()
            }}
            style={{ flex: 1 }}
          >
            Retour
          </Button>
          <Button
            onClick={() => {
              window.location.href = '/authors'
            }}
            style={{ flex: 1 }}
          >
            Liste des auteurs
          </Button>
        </div>
      </Card>
    </div>
  )
}
