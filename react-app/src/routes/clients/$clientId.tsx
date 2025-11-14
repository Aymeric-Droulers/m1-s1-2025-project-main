import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, type JSX } from 'react'
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Spin,
  List,
  Typography,
} from 'antd'
import {
  UserOutlined,
  MailOutlined,
  LinkOutlined,
  SaveOutlined,
  EditOutlined,
  BookOutlined,
} from '@ant-design/icons'

const { Text } = Typography

export const Route = createFileRoute('/clients/$clientId')({
  component: ClientDetails,
})

interface ClientFormValues {
  first_name: string
  last_name: string
  mail: string
  photo_link?: string
}

type Book = {
  id: string
  title: string
  description: string
  pictureUrl: string
  yearPublished: number
  author: {
    id: string
    firstName: string
    lastName: string
  }
}

type Client = {
  id: string
  first_name: string
  last_name: string
  mail: string
  photo_link: string
  books_bought: Book[]
  nb_books_bought: number
}

function ClientDetails(): JSX.Element {
  const { clientId } = Route.useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [editing, setEditing] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)
  const [form] = Form.useForm()
  const [error, setError] = useState<string | null>(null)

  // Charger les données du client
  useEffect((): void => {
    const fetchClient = async (): Promise<void> => {
      try {
        setLoading(true)
        setError(null)

        const res: Response = await fetch(
          `http://localhost:3000/clients/${clientId}`,
        )

        if (!res.ok) {
          throw new Error(`Client non trouvé (${res.status})`)
        }

        const data: Client = await res.json()
        setClient(data)
        form.setFieldsValue({
          first_name: data.first_name,
          last_name: data.last_name,
          mail: data.mail,
          photo_link: data.photo_link || '',
        })
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erreur lors du chargement',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchClient()
  }, [clientId, form])

  // Sauvegarder les modifications
  const handleSave = async (values: ClientFormValues): Promise<void> => {
    setSaving(true)
    try {
      const updatedClient = {
        first_name: values.first_name,
        last_name: values.last_name,
        mail: values.mail,
        photo_link: values.photo_link || '',
      }

      const res: Response = await fetch(
        `http://localhost:3000/clients/${clientId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(updatedClient),
        },
      )

      if (!res.ok) {
        throw new Error('Erreur lors de la mise à jour')
      }

      // Recharger les données
      const updatedResponse: Response = await fetch(
        `http://localhost:3000/clients/${clientId}`,
      )
      if (updatedResponse.ok) {
        const savedClient: Client = await updatedResponse.json()
        setClient(savedClient)
      }

      setEditing(false)
      message.success('Client modifié avec succès')
    } catch (err) {
      console.error('Erreur modification client:', err)
      message.error('Erreur lors de la modification du client')
    } finally {
      setSaving(false)
    }
  }

  // Navigation vers la page détail d'un livre
  const goToBookDetails = (bookId: string): void => {
    navigate({ to: '/books/$bookId', params: { bookId } })
  }

  // Activer le mode édition
  const handleEdit = (): void => {
    setEditing(true)
  }

  // Annuler l'édition
  const handleCancel = (): void => {
    setEditing(false)
    if (client) {
      form.setFieldsValue({
        first_name: client.first_name,
        last_name: client.last_name,
        mail: client.mail,
        photo_link: client.photo_link || '',
      })
    }
  }

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
        }}
      >
        <Spin size="large" />
      </div>
    )
  }

  if (error || !client) {
    return (
      <div style={{ padding: '24px', maxWidth: '500px', margin: '0 auto' }}>
        <Card>
          <div style={{ textAlign: 'center', color: 'red' }}>
            {error || 'Client non trouvé'}
          </div>
          <Button
            onClick={async (): Promise<void> =>
              await navigate({ to: '/clients' })
            }
            style={{ marginTop: '16px', width: '100%' }}
          >
            Retour à la liste
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Carte informations client */}
      <Card
        title={`Détails du Client ${editing ? '(Modification)' : ''}`}
        extra={
          !editing ? (
            <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
              Modifier
            </Button>
          ) : null
        }
        style={{
          backgroundColor: '#808080',
          border: '2px solid #000',
          borderRadius: '8px',
          marginBottom: '24px',
        }}
        bodyStyle={{
          backgroundColor: '#808080',
          padding: '24px',
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          autoComplete="off"
          style={{ backgroundColor: '#808080' }}
          disabled={saving}
        >
          <Form.Item
            label="Prénom"
            name="first_name"
            rules={[{ required: true, message: 'Veuillez saisir le prénom' }]}
            style={{ marginBottom: 16 }}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Saisir le prénom"
              style={{ backgroundColor: 'white' }}
              disabled={!editing || saving}
            />
          </Form.Item>

          <Form.Item
            label="Nom"
            name="last_name"
            rules={[{ required: true, message: 'Veuillez saisir le nom' }]}
            style={{ marginBottom: 16 }}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Saisir le nom"
              style={{ backgroundColor: 'white' }}
              disabled={!editing || saving}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="mail"
            rules={[
              { required: true, message: "Veuillez saisir l'email" },
              { type: 'email', message: "Format d'email invalide" },
            ]}
            style={{ marginBottom: 16 }}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Saisir l'email"
              style={{ backgroundColor: 'white' }}
              disabled={!editing || saving}
            />
          </Form.Item>

          <Form.Item
            label="Lien de la photo (facultatif)"
            name="photo_link"
            style={{ marginBottom: 24 }}
          >
            <Input
              prefix={<LinkOutlined />}
              placeholder="https://example.com/photo.jpg"
              style={{ backgroundColor: 'white' }}
              disabled={!editing || saving}
            />
          </Form.Item>

          {editing ? (
            <Form.Item style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  onClick={handleCancel}
                  disabled={saving}
                  style={{ flex: 1 }}
                >
                  Annuler
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={saving}
                  icon={<SaveOutlined />}
                  style={{ flex: 1 }}
                >
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              </div>
            </Form.Item>
          ) : null}
        </Form>

        {client.photo_link && client.photo_link.trim() !== '' && (
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <p style={{ color: 'white', marginBottom: '8px' }}>
              Photo actuelle :
            </p>
            <img
              src={client.photo_link}
              alt={`${client.first_name} ${client.last_name}`}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid white',
              }}
              onError={(
                e: React.SyntheticEvent<HTMLImageElement, Event>,
              ): void => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}
      </Card>

      {/* Carte livres achetés */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOutlined />
            <span>Livres Achetés ({client.nb_books_bought})</span>
          </div>
        }
        style={{
          backgroundColor: '#808080',
          border: '2px solid #000',
          borderRadius: '8px',
        }}
        bodyStyle={{
          backgroundColor: '#808080',
          padding: '24px',
        }}
      >
        {client.books_bought && client.books_bought.length > 0 ? (
          <List
            dataSource={client.books_bought}
            renderItem={(book: Book) => (
              <List.Item
                style={{
                  cursor: 'pointer',
                  backgroundColor: '#808080',
                  borderBottom: '1px solid #000',
                  padding: '16px 0',
                }}
                onClick={(): void => goToBookDetails(book.id)}
                actions={[
                  <Button
                    key="details"
                    type="link"
                    icon={<BookOutlined />}
                    onClick={(): void => goToBookDetails(book.id)}
                  >
                    Voir détails
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    book.pictureUrl ? (
                      <img
                        src={book.pictureUrl}
                        alt={book.title}
                        style={{
                          width: '60px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '60px',
                          height: '80px',
                          backgroundColor: '#1890ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '4px',
                          color: 'white',
                        }}
                      >
                        <BookOutlined />
                      </div>
                    )
                  }
                  title={
                    <Text strong style={{ color: 'white', fontSize: '16px' }}>
                      {book.title}
                    </Text>
                  }
                  description={
                    <div style={{ color: '#f0f0f0' }}>
                      <div>
                        <strong>Auteur :</strong> {book.author.firstName}{' '}
                        {book.author.lastName}
                      </div>
                      <div>
                        <strong>Année :</strong> {book.yearPublished}
                      </div>
                      {book.description && (
                        <div style={{ marginTop: '4px' }}>
                          {book.description.length > 100
                            ? `${book.description.substring(0, 100)}...`
                            : book.description}
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'white' }}>
            <BookOutlined
              style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}
            />
            <div>Aucun livre acheté</div>
            <Text type="secondary" style={{ color: '#f0f0f0' }}>
              Ce client n&apos;a pas encore acheté de livres
            </Text>
          </div>
        )}
      </Card>

      {/* Boutons de navigation */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <Button
          onClick={async (): Promise<void> =>
            await navigate({ to: '/clients' })
          }
          style={{ flex: 1 }}
        >
          Liste des clients
        </Button>
        <Button
          onClick={async (): Promise<void> =>
            await navigate({ to: '/clients/create' })
          }
          style={{ flex: 1 }}
        >
          Créer un client
        </Button>
      </div>
    </div>
  )
}
