import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Card, message, Spin, Alert } from 'antd'
import {
  UserOutlined,
  MailOutlined,
  LinkOutlined,
  SaveOutlined,
  EditOutlined,
} from '@ant-design/icons'

export const Route = createFileRoute('/books/$bookId')({
  component: BookDetails,
})

type Book = {
  id: string
  first_name: string
  last_name: string
  mail: string
  photo_link: string
  books_bought: any[]
  nb_books_bought: number
  title: string
}

export function BookDetails() {
  const { bookId } = Route.useParams()
  const [book, setClient] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form] = Form.useForm()
  const [error, setError] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  // Charger les données du client
  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const res = await fetch(`http://localhost:3000/books/${bookId}`)
        
        if (!res.ok) {
          throw new Error(`Client non trouvé (${res.status})`)
        }
        
        const data = await res.json()
        setClient(data)
        form.setFieldsValue({
          title: data.title,
          yearPublished: data.yearPublished,
          description: data.description,
          pictureUrl: data.pictureUrl || ''
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement')
      } finally {
        setLoading(false)
      }
    }

    fetchClient()
  }, [bookId, form])

  // Sauvegarder les modifications avec PATCH
  const handleSave = async (values: any) => {
    console.log('Données à sauvegarder:', values)
    setSaving(true)
    setApiError(null)
    
    try {
      const updatedClient = {
        title: values.title,
        yearPublished: values.yearPublished,
        description: values.description,
        pictureUrl: values.pictureUrl || ''
      }

      console.log('Envoi PATCH vers:', `http://localhost:3000/books/${bookId}`)
      console.log('Données envoyées:', updatedClient)

      const res = await fetch(`http://localhost:3000/books/${bookId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(updatedClient),
      })

      console.log('Statut PATCH:', res.status)

      if (!res.ok) {
        let errorMessage = `Erreur ${res.status}`
        try {
          const errorText = await res.text()
          console.log('Erreur texte:', errorText)
          errorMessage += `: ${errorText}`
        } catch {
          errorMessage += `: ${res.statusText}`
        }
        throw new Error(errorMessage)
      }

      // Recharger les données après la modification
      const updatedResponse = await fetch(`http://localhost:3000/books/${bookId}`)
      if (updatedResponse.ok) {
        const savedClient = await updatedResponse.json()
        setClient(savedClient)
        console.log('Client mis à jour:', savedClient)
      }

      setEditing(false)
      message.success('Client modifié avec succès')
      
    } catch (err) {
      console.error('Erreur détaillée:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      setApiError(errorMessage)
      message.error('Erreur lors de la modification du client')
    } finally {
      setSaving(false)
    }
  }

  // Activer le mode édition
  const handleEdit = () => {
    setEditing(true)
    setApiError(null)
  }

  // Annuler l'édition
  const handleCancel = () => {
    setEditing(false)
    setApiError(null)
    if (book) {
      form.setFieldsValue({
        title: book.title,
        last_name: book.last_name,
        mail: book.mail,
        photo_link: book.photo_link || ''
      })
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (error || !book) {
    return (
      <div style={{ padding: '24px', maxWidth: '500px', margin: '0 auto' }}>
        <Card>
          <div style={{ textAlign: 'center', color: 'red' }}>
            {error || 'Client non trouvé'}
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
          padding: '24px'
        }}
      >
        {/* Message d'erreur API */}
        {apiError && (
          <Alert
            message="Erreur de sauvegarde"
            description={
              <div>
                <p>Le backend a retourné une erreur :</p>
                <code style={{ 
                  fontSize: '12px', 
                  background: '#f5f5f5', 
                  padding: '8px', 
                  display: 'block', 
                  marginTop: '8px',
                  borderRadius: '4px',
                  color: '#d32f2f'
                }}>
                  {apiError}
                </code>
                <p style={{ marginTop: '12px', fontSize: '12px' }}>
                  
                </p>
              </div>
            }
            type="error"
            showIcon
            closable
            onClose={() => setApiError(null)}
            style={{ marginBottom: '16px' }}
          />
        )}

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
            rules={[{ required: true, message: 'Veuillez saisir la date de publication' }]}
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
              { required: true, message: 'Veuillez saisir une description' }            ]}
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

        {/* achteurs TODO */}
        <div style={{ marginTop: '16px', color: 'white' }}>
          <p><strong>Clients ayant achetés ce livre:</strong> {book.nb_books_bought}</p>
          {book.books_bought && book.books_bought.length > 0 && (
            <p><strong>Dernier achat:</strong> {book.books_bought[book.books_bought.length - 1]}</p>
          )}
        </div>

        {book.photo_link && book.photo_link.trim() !== '' && (
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <p style={{ color: 'white', marginBottom: '8px' }}>Photo actuelle :</p>
            <img 
              src={book.photo_link}
              alt={`${book.first_name} ${book.last_name}`}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid white'
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}
      </Card>

      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <Button 
          onClick={() => window.history.back()}
          style={{ flex: 1 }}
        >
          Retour
        </Button>
        <Button 
          onClick={() => window.location.href = '/books'}
          style={{ flex: 1 }}
        >
          Liste des livres
        </Button>
      </div>
    </div>
  )
}