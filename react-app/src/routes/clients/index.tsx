/**
 * Page listant tous les clients
 * Affiche la liste des clients avec possibilité de les consulter, créer ou supprimer
 * Charge les données depuis l'API au montage du composant
 */

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import React, { useState, useEffect, type JSX } from 'react'
import { List, Button, Modal, message, Card } from 'antd'

// Configuration de la route pour la liste des clients
export const Route = createFileRoute('/clients/')({
  component: ClientsList,
})

// Type représentant un livre simplifié
type Book = {
  id: string
  title: string
}

// Type représentant un client avec ses informations
type Client = {
  id: string
  first_name: string
  last_name: string
  mail: string
  photo_link: string
  books_bought: Book[]
  nb_books_bought: number
}

// Données initiales par défaut (avant chargement de l'API)
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

/**
 * Composant principal affichant la liste des clients
 * Gère l'affichage, la navigation et la suppression des clients
 */
function ClientsList(): JSX.Element {
  // Hook de navigation pour rediriger vers d'autres pages
  const navigate = useNavigate()
  // État contenant la liste des clients
  const [clients, setClients] = useState<Client[]>(initialClients)
  // État pour contrôler l'affichage de la modale de suppression
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  // État contenant le client à supprimer
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)

  /**
   * Effet pour charger la liste des clients depuis l'API au montage
   * Utilise un flag 'mounted' pour éviter les mises à jour après démontage
   */
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

  /**
   * Navigation vers la page de détails d'un client
   * @param clientId - L'identifiant du client à consulter
   */
  const goToClientDetails = (clientId: string): void => {
    navigate({ to: '/clients/$clientId', params: { clientId } })
  }

  /**
   * Navigation vers la page de création d'un nouveau client
   */
  const goToCreateClient = (): void => {
    navigate({ to: '/clients/create' })
  }

  /**
   * Gère le clic sur le bouton de suppression
   * Empêche la propagation de l'événement et ouvre la modale de confirmation
   * @param client - Le client à supprimer
   * @param e - L'événement de clic
   */
  const handleDeleteClick = (client: Client, e: React.MouseEvent): void => {
    e.stopPropagation()
    setClientToDelete(client)
    setShowDeleteModal(true)
  }

  /**
   * Confirme et exécute la suppression du client
   * Envoie une requête DELETE à l'API puis met à jour la liste locale
   */
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

  // Rendu de la liste des clients
  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Carte contenant la liste des clients */}
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
        {/* Liste affichant chaque client avec bouton de suppression */}
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

      {/* Modale de confirmation de suppression */}
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
        {/* Message de confirmation avec nom du client */}
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
