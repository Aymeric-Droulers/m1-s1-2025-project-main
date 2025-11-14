import { createFileRoute, useNavigate } from '@tanstack/react-router'
import React, { useState, useEffect, type JSX } from 'react'
import { List, Button, Modal, message, Card } from 'antd'

export const Route = createFileRoute('/clients/')({
  component: ClientsList,
})

type Book = {
  id: string
  title: string
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

const initialClients: Client[] = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    mail: 'john@example.com',
    photo_link: '',
    books_bought: [],
    nb_books_bought: 0,
  },
  {
    id: '2',
    first_name: 'Jane',
    last_name: 'Smith',
    mail: 'jane@example.com',
    photo_link: '',
    books_bought: [],
    nb_books_bought: 0,
  },
  {
    id: '3',
    first_name: 'Alice',
    last_name: 'Johnson',
    mail: 'alice@example.com',
    photo_link: '',
    books_bought: [],
    nb_books_bought: 0,
  },
]

function ClientsList(): JSX.Element {
  const navigate = useNavigate()
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)

  // Récupérer la liste des clients depuis le backend
  useEffect(() => {
    let mounted: boolean = true
    const load = async (): Promise<void> => {
      try {
        const res: Response = await fetch('http://localhost:3000/clients')
        if (!res.ok) {
          console.error('Impossible de charger les clients')
          return
        }
        const data: Client[] = await res.json()
        if (mounted && Array.isArray(data)) setClients(data)
      } catch (err) {
        console.error('Erreur lors du fetch clients:', err)
        message.error('Erreur lors du chargement des clients')
      }
    }
    load()
    return (): void => {
      mounted = false
    }
  }, [])

  // Navigation vers la page de détails
  const goToClientDetails = (clientId: string): void => {
    navigate({ to: '/clients/$clientId', params: { clientId } })
  }

  // Navigation vers la page de création
  const goToCreateClient = (): void => {
    navigate({ to: '/clients/create' })
  }

  const handleDeleteClick = (client: Client, e: React.MouseEvent): void => {
    e.stopPropagation()
    setClientToDelete(client)
    setShowDeleteModal(true)
  }

  const confirmDelete = async (): Promise<void> => {
    if (!clientToDelete) return

    try {
      const res: Response = await fetch(
        `http://localhost:3000/clients/${clientToDelete.id}`,
        {
          method: 'DELETE',
        },
      )

      if (!res.ok) {
        throw new Error('Échec de la suppression')
      }

      setClients(clients.filter((c: Client) => c.id !== clientToDelete.id))
      message.success('Client supprimé avec succès')
    } catch (err) {
      console.error('Erreur suppression client:', err)
      message.error('Erreur lors de la suppression du client')
    } finally {
      setShowDeleteModal(false)
      setClientToDelete(null)
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
          padding: '24px',
        }}
        extra={
          <Button type="primary" onClick={goToCreateClient}>
            Créer un client
          </Button>
        }
      >
        <List
          dataSource={clients}
          renderItem={(client: Client) => (
            <List.Item
              actions={[
                <Button
                  key="delete"
                  danger
                  onClick={(e: React.MouseEvent): void =>
                    handleDeleteClick(client, e)
                  }
                >
                  Supprimer
                </Button>,
              ]}
              style={{
                cursor: 'pointer',
                backgroundColor: '#808080',
                borderBottom: '1px solid #000',
                padding: '12px 0',
              }}
              onClick={(): void => goToClientDetails(client.id)}
            >
              <List.Item.Meta
                title={
                  <span
                    style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    {client.first_name} {client.last_name}
                  </span>
                }
                description={
                  <span style={{ color: 'white' }}>
                    {client.nb_books_bought} livre(s) acheté(s)
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
        onCancel={(): void => {
          setShowDeleteModal(false)
          setClientToDelete(null)
        }}
        okText="Supprimer"
        cancelText="Annuler"
        okType="danger"
      >
        <p>
          Êtes-vous sûr de vouloir supprimer le client{' '}
          <strong>
            {clientToDelete?.first_name} {clientToDelete?.last_name}
          </strong>
          ?
        </p>
        <p>Cette action est irréversible.</p>
      </Modal>
    </div>
  )
}
