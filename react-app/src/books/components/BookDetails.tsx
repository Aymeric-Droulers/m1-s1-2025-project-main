import { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Spin,
  Alert,
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
import { useBook } from '../providers/useBookDetailsProvider'
import type { BookUpdatePayload } from '../BookModel'
import { CreateBookModal } from './CreatePurchaseModal'
import { SafeImage } from '../../components/SafeImage'

export function BookDetails() {
  const {
    book,
    loading,
    error,
    saving,
    apiError,
    updateBook,
    clearApiError,
    purchaseBook,
  } = useBook()

  const [editing, setEditing] = useState(false)
  const [form] = Form.useForm()

  // Remplir le formulaire quand on a le livre
  useEffect(() => {
    if (book) {
      form.setFieldsValue({
        title: book.title,
        yearPublished: book.yearPublished,
        description: book.description,
        pictureUrl: book.pictureUrl || '',
      })
    }
  }, [book, form])

  const handleSave = async (values: BookUpdatePayload) => {
    try {
      await updateBook(values)
      setEditing(false)
      message.success('Livre modifié avec succès')
    } catch {
      message.error('Erreur lors de la modification du livre')
    }
  }

  const handleEdit = () => {
    setEditing(true)
    clearApiError()
  }

  const handleCancel = () => {
    setEditing(false)
    clearApiError()
    if (book) {
      form.setFieldsValue({
        title: book.title,
        yearPublished: book.yearPublished,
        description: book.description,
        pictureUrl: book.pictureUrl || '',
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

  if (error || !book) {
    return (
      <div style={{ padding: '24px', maxWidth: '500px', margin: '0 auto' }}>
        <Card>
          <div style={{ textAlign: 'center', color: 'red' }}>
            {error || 'Livre non trouvé'}
          </div>
          <Button
            onClick={() => window.history.back()}
            style={{ marginTop: '16px', width: '100%' }}
          >
            Retour
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <>
      <CreateBookModal onCreate={purchaseBook} bookId={book.id} />
      <div style={{ padding: '0 .5rem' }}></div>
      <div style={{ padding: '24px', maxWidth: '500px', margin: '0 auto' }}>
        <Card
          title={`Détails du Livre ${editing ? '(Modification)' : ''}`}
          extra={
            !editing ? (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEdit}
              >
                Modifier
              </Button>
            ) : null
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
          {apiError && (
            <Alert
              message="Erreur de sauvegarde"
              description={
                <div>
                  <p>Le backend a retourné une erreur :</p>
                  <code
                    style={{
                      fontSize: '12px',
                      background: '#f5f5f5',
                      padding: '8px',
                      display: 'block',
                      marginTop: '8px',
                      borderRadius: '4px',
                      color: '#d32f2f',
                    }}
                  >
                    {apiError}
                  </code>
                </div>
              }
              type="error"
              showIcon
              closable
              onClose={clearApiError}
              style={{ marginBottom: '16px' }}
            />
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <SafeImage src={book.pictureUrl} size={120} />
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            autoComplete="off"
            style={{ backgroundColor: '#808080' }}
            disabled={saving}
          >
            <Form.Item
              label="Titre"
              name="title"
              rules={[{ required: true, message: 'Veuillez saisir le titre' }]}
              style={{ marginBottom: 16 }}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Saisir le titre"
                style={{ backgroundColor: 'white' }}
                disabled={!editing || saving}
              />
            </Form.Item>

            <Form.Item
              label="Date de publication"
              name="yearPublished"
              rules={[
                {
                  required: true,
                  message: 'Veuillez saisir la date de publication',
                },
              ]}
              style={{ marginBottom: 16 }}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Saisir la date de publication"
                style={{ backgroundColor: 'white' }}
                disabled={!editing || saving}
              />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: 'Veuillez saisir une description' },
              ]}
              style={{ marginBottom: 16 }}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Saisir une description"
                style={{ backgroundColor: 'white' }}
                disabled={!editing || saving}
              />
            </Form.Item>

            <Form.Item
              label="Lien de la photo (facultatif)"
              name="pictureUrl"
              style={{ marginBottom: 24 }}
            >
              <Input
                prefix={<LinkOutlined />}
                placeholder="https://example.com/photo.jpg"
                style={{ backgroundColor: 'white' }}
                disabled={!editing || saving}
              />
            </Form.Item>

            {editing && (
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
            )}
          </Form>

          {/* acheteurs */}

          <div style={{ marginTop: '16px', color: 'white' }}>
            <p>
              <strong>Clients ayant acheté ce livre :</strong>{' '}
              {book.achats ? book.achats.length : 0}
            </p>

            {book.achats &&
              book.achats.length > 0 &&
              (() => {
                const last = book.achats[book.achats.length - 1]
                return (
                  <p
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      justifyContent: 'center',
                    }}
                  >
                    {last.photo_link ? (
                      <img
                        src={last.photo_link}
                        alt={`${last.first_name} ${last.last_name}`}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                        onError={e => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <UserOutlined style={{ fontSize: 24, color: 'white' }} />
                    )}
                    <span>
                      <strong>Dernier achat :</strong> {last.first_name}{' '}
                      {last.last_name} ({last.mail})
                    </span>
                  </p>
                )
              })()}
          </div>
        </Card>

        {/* Carte livres achetés */}

        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOutlined />
              <span>
                Clients ayant acheté ce livre (
                {book.achats ? book.achats.length : 0})
              </span>
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
          {book.achats && book.achats.length > 0 ? (
            <List
              dataSource={book.achats}
              renderItem={client => (
                <List.Item
                  key={client.id}
                  style={{
                    backgroundColor: '#808080',
                    borderBottom: '1px solid #000',
                    padding: '16px 0',
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      client.photo_link ? (
                        <img
                          src={client.photo_link}
                          alt={`${client.first_name} ${client.last_name}`}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <UserOutlined
                          style={{ fontSize: 24, color: 'white' }}
                        />
                      )
                    }
                    title={
                      <Typography.Text
                        strong
                        style={{ color: 'white', fontSize: '16px' }}
                      >
                        {client.first_name} {client.last_name}
                      </Typography.Text>
                    }
                    description={
                      <div style={{ color: '#f0f0f0' }}>
                        <div>{client.mail}</div>
                        <div>Achat(s) : {client.nb_books_bought}</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <div
              style={{ textAlign: 'center', padding: '40px', color: 'white' }}
            >
              <BookOutlined
                style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}
              />
              <div>Aucun achat pour ce livre</div>
              <Typography.Text type="secondary" style={{ color: '#f0f0f0' }}>
                Ce livre n&apos;a pas encore été acheté
              </Typography.Text>
            </div>
          )}
        </Card>

        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <Button onClick={() => window.history.back()} style={{ flex: 1 }}>
            Retour
          </Button>
          <Button
            onClick={() => {
              window.location.href = '/books'
            }}
            style={{ flex: 1 }}
          >
            Liste des livres
          </Button>
        </div>
      </div>
    </>
  )
}
