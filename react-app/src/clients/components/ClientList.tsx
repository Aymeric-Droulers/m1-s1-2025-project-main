import { useEffect, useState, type MouseEvent } from 'react'
import { Button, Card, List, Modal } from 'antd'
import { Link } from '@tanstack/react-router'

import { useClientProvider } from '../providers/useClientProvider.tsx'
import type { ClientModel } from '../ClientModel.tsx'

export function ClientList() {
  const { clients, loadClients, deleteClient } = useClientProvider()

  // Charger la liste des clients au montage
  useEffect(() => {
    loadClients()
  }, [])

  // État pour la modale de suppression
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<ClientModel | null>(null)

  /**
   * Clic sur le bouton "Supprimer"
   * On stoppe la propagation pour ne pas déclencher le clic sur le lien
   */
  const handleDeleteClick = (
    client: ClientModel,
    e: MouseEvent<HTMLButtonElement>,
  ): void => {
    e.stopPropagation()
    setClientToDelete(client)
    setShowDeleteModal(true)
  }

  /**
   * Confirme la suppression
   */
  const confirmDelete = (): void => {
    if (!clientToDelete) return
    deleteClient(clientToDelete.id)
    setShowDeleteModal(false)
    setClientToDelete(null)
  }

  /**
   * Annule la suppression
   */
  const cancelDelete = (): void => {
    setShowDeleteModal(false)
    setClientToDelete(null)
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
            to="/clients/create"
            style={{ margin: 'auto 0', textAlign: 'left', color: 'white' }}
          >
            Créer un client
          </Link>
        }
      >
        <List
          dataSource={clients}
          style={{ backgroundColor: '#808080' }}
          renderItem={(client: ClientModel) => (
            <List.Item
              actions={[
                <Button
                  key="delete"
                  danger
                  onClick={(e): void => handleDeleteClick(client, e)}
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
                  <Link
                    to="/clients/$clientId"
                    params={{ clientId: client.id }}
                    style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    {client.first_name} {client.last_name}
                  </Link>
                }
                description={
                  <span style={{ color: 'white' }}>
                    {client.nb_books_bought} livre(s) acheté(s)
                  </span>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* Modale de confirmation de suppression */}
      <Modal
        title="Confirmer la suppression"
        open={showDeleteModal}
        onOk={confirmDelete}
        onCancel={cancelDelete}
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
