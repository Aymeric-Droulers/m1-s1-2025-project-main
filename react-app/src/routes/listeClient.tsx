import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useEffect } from 'react'

export const Route = createFileRoute('/listeClient')({
  component: ListeClient,
})

type Client = {
  id: string
  first_name: string
  last_name: string
  mail: string
  photoLink: string
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
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newClient, setNewClient] = useState<{
    first_name: string
    last_name: string
    mail: string
    photoLink: string
  }>({
    first_name: '',
    last_name: '',
    mail: '',
    photoLink: '',
  })

  // Récupérer la liste des clients depuis le backend (si disponible)
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
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  // Navigation fictive vers la page de détails (à remplacer par un vrai routeur)
  const goToClientDetails = (clientId: number) => {
    window.location.href = `/client/${clientId}`
  }

  const handleDelete = (client: Client) => {
    setClientToDelete(client)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (clientToDelete) {
      try {
        const res = await fetch(`http://localhost:3000/clients/${clientToDelete.id}`, { method: 'DELETE' })
        if (!res.ok) {
          console.error('Échec suppression client')
          alert('Erreur lors de la suppression')
        } else {
          setClients(clients.filter(c => c.id !== clientToDelete.id))
        }
      } catch (err) {
        console.error('Erreur réseau:', err)
        alert('Erreur réseau lors de la suppression')
      }
    }
    setShowDeleteModal(false)
    setClientToDelete(null)
  }

  const handleCreateClient = async () => {
    try {
      const res = await fetch('http://localhost:3000/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      })
      if (!res.ok) {
        const text = await res.text()
        console.error('Erreur création client:', text)
        alert('Erreur lors de la création du client')
        return
      }
      const created = await res.json()
      setClients([...clients, created])
      setShowCreateModal(false)
      setNewClient({ first_name: '', last_name: '', mail: '', photoLink: '' })
    } catch (err) {
      console.error('Erreur réseau:', err)
      alert('Erreur réseau lors de la création')
    }
  }

  return (
    <div>
      <h2>Liste des Clients</h2>
      <button onClick={() => setShowCreateModal(true)}>Créer un client</button>
      <ul className="divide-y divide-gray-200">
        {clients.map(client => (
          <li
            key={client.id}
            className="py-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
          >
            <div
              onClick={() => goToClientDetails(client.id)}
              className="flex-1"
            >
              <span className="font-semibold">
                {client.first_name} {client.last_name}
              </span>
              <span className="ml-4 text-gray-500">{client.mail}</span>
            </div>
            <button
              className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              onClick={e => {
                e.stopPropagation()
                handleDelete(client)
              }}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>

      {/* Modale de suppression */}
      {showDeleteModal && clientToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-bold mb-4">Confirmer la suppression</h3>
            <p>
              Voulez-vous vraiment supprimer {clientToDelete.first_name}{' '}
              {clientToDelete.last_name} ?
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={confirmDelete}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale de création */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-bold mb-4">Créer un client</h3>
            <form
              onSubmit={e => {
                e.preventDefault()
                handleCreateClient()
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={newClient.first_name}
                  onChange={e =>
                    setNewClient({ ...newClient, first_name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nom
                </label>
                <input
                  type="text"
                  id="last_name"
                  value={newClient.last_name}
                  onChange={e =>
                    setNewClient({ ...newClient, last_name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                Créer
              </button>
            </form>
            <button
              className="mt-4 w-full px-4 py-2 bg-gray-300 rounded"
              onClick={() => setShowCreateModal(false)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
