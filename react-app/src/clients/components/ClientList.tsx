import { useEffect, useState } from 'react'

import { useClientProvider } from '../providers/useClientProvider.tsx'
import { Button, Card, List, Modal } from 'antd'
import type { ClientModel } from '../ClientModel.tsx'
import { Link } from '@tanstack/react-router'

export function ClientList() {
  const { clients, loadClients, createClient, updateClient, deleteClient } =
    useClientProvider()

  useEffect(() => {
    loadClients()
  }, [loadClients])

  // État pour contrôler l'affichage de la modale de suppression
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  // État contenant le client à supprimer
  const [clientToDelete, setClientToDelete] = useState<ClientModel | null>(null)






  /**
   * Gère le clic sur le bouton de suppression
   * Empêche la propagation de l'événement et ouvre la modale de confirmation
   * @param client - Le client à supprimer
   * @param e - L'événement de clic
   */
  const handleDeleteClick = (
    client: ClientModel,
    e: React.MouseEvent,
  ): void => {
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
    deleteClient(clientToDelete.id)
  }

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
          <Link
            to={`/clients/create`}
            style={{ margin: 'auto 0', textAlign: 'left' }}
          >
            Create a client
          </Link>
        }
      >
        {/* Liste affichant chaque client avec bouton de suppression */}
        <List
          dataSource={clients}
          renderItem={(client: ClientModel) => (
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
