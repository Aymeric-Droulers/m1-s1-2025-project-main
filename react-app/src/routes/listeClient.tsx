import { createFileRoute, useNavigate } from '@tanstack/react-router'
import React, { useState, useEffect } from 'react'
import { List, Button, Modal, Form, Input, message, Card } from 'antd'

export const Route = createFileRoute('/listeClient')({
  component: ListeClient,
})

type Client = {
  id: string
  first_name: string
  last_name: string
  mail: string
  photo_link: string  
  books_bought: any[]
  nb_books_bought: number
}

const initialClients: Client[] = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    mail: 'john@example.com',
    photoLink: '',
  },
  {
    id: '2',
    first_name: 'Jane',
    last_name: 'Smith',
    mail: 'jane@example.com',
    photoLink: '',
  },
  {
    id: '3',
    first_name: 'Alice',
    last_name: 'Johnson',
    mail: 'alice@example.com',
    photoLink: '',
  },
]

function ListeClient() {
  const navigate = useNavigate()
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  // Récupérer la liste des clients depuis le backend
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await fetch('http://localhost:3000/clients')
        if (!res.ok) {
          console.error('Impossible de charger les clients')
          return
        }
        const data = await res.json()
        if (mounted && Array.isArray(data)) setClients(data)
      } catch (err) {
        console.error('Erreur lors du fetch clients:', err)
        message.error('Erreur lors du chargement des clients')
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  // Navigation vers la page de détails
  const goToClientDetails = (clientId: string) => {
    navigate({ to: '/client/$clientId', params: { clientId } })
  }

  const handleDeleteClick = (client: Client, e: React.MouseEvent) => {
    e.stopPropagation()
    setClientToDelete(client)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!clientToDelete) return

    try {
      const res = await fetch(`http://localhost:3000/clients/${clientToDelete.id}`, { 
        method: 'DELETE' 
      })
      
      if (!res.ok) {
        throw new Error('Échec de la suppression')
      }
      
      setClients(clients.filter(c => c.id !== clientToDelete.id))
      message.success('Client supprimé avec succès')
    } catch (err) {
      console.error('Erreur suppression client:', err)
      message.error('Erreur lors de la suppression du client')
    } finally {
      setShowDeleteModal(false)
      setClientToDelete(null)
    }
  }

  const handleCreateClient = async (values: any) => {
    setLoading(true)
    try {
      const clientData = {
        first_name: values.first_name,
        last_name: values.last_name,
        mail: values.mail,
        photoLink: values.photoLink || ''
      }

      const res = await fetch('http://localhost:3000/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      })
      
      if (!res.ok) {
        throw new Error('Erreur lors de la création')
      }
      
      const created = await res.json()
      setClients([...clients, created])
      setShowCreateModal(false)
      form.resetFields()
      message.success('Client créé avec succès')
    } catch (err) {
      console.error('Erreur création client:', err)
      message.error('Erreur lors de la création du client')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Card 
        title="Liste des Clients"
        style={{ 
          backgroundColor: '#808080',
          border: '2px solid #000',
          borderRadius: '8px',
        }}
        bodyStyle={{ 
          backgroundColor: '#808080',
          padding: '24px'
        }}
        extra={
          <Button 
            type="primary" 
            onClick={() => setShowCreateModal(true)}
          >
            Créer un client
          </Button>
        }
      >
        <List
          dataSource={clients}
          renderItem={client => (
            <List.Item
              actions={[
                <Button 
                  danger 
                  onClick={(e) => handleDeleteClick(client, e)}
                >
                  Supprimer
                </Button>
              ]}
              style={{ 
                cursor: 'pointer',
                backgroundColor: '#808080',
                borderBottom: '1px solid #000',
                padding: '12px 0'
              }}
              onClick={() => goToClientDetails(client.id)}
            >
              <List.Item.Meta
                title={
                  <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
                    {client.first_name} {client.last_name}
                  </span>
                }
              />
            </List.Item>
          )}
          style={{ backgroundColor: '#808080' }}
        />
      </Card>

      {/* Modale de suppression */}
      <Modal
        title="Confirmer la suppression"
        open={showDeleteModal}
        onOk={confirmDelete}
        onCancel={() => {
          setShowDeleteModal(false)
          setClientToDelete(null)
        }}
        okText="Supprimer"
        cancelText="Annuler"
        okType="danger"
      >
        <p>
          Êtes-vous sûr de vouloir supprimer le client{" "}
          <strong>
            {clientToDelete?.first_name} {clientToDelete?.last_name}
          </strong>
          ?
        </p>
        <p>Cette action est irréversible.</p>
      </Modal>

      {/* Modal de création */}
      <Modal
        title="Créer un nouveau client"
        open={showCreateModal}
        onCancel={() => {
          setShowCreateModal(false)
          form.resetFields()
        }}
        footer={null}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateClient}
        >
          <Form.Item
            label="Prénom"
            name="first_name"
            rules={[{ required: true, message: 'Veuillez saisir le prénom' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Nom"
            name="last_name"
            rules={[{ required: true, message: 'Veuillez saisir le nom' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="mail"
            rules={[
              { required: true, message: 'Veuillez saisir l\'email' },
              { type: 'email', message: 'Format d\'email invalide' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Lien de la photo (facultatif)"
            name="photoLink"
          >
            <Input placeholder="https://example.com/photo.jpg" />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button 
                onClick={() => {
                  setShowCreateModal(false)
                  form.resetFields()
                }}
              >
                Annuler
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
              >
                Créer
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}