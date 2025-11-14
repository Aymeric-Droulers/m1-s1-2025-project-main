import { useState } from 'react'
import axios from 'axios'
import type {
  ClientModel,
  CreateClientModel,
  UpdateClientModel,
} from '../ClientModel.tsx'

export const useClientProvider = () => {
  const [clients, setClients] = useState<ClientModel[]>([])

  const loadClients = () => {
    axios
      .get('http://localhost:3000/clients')
      .then(res => {
        const payload = res.data
        const list = Array.isArray(payload)
          ? payload
          : (payload.clients ?? payload.items ?? payload.data ?? [])
        setClients(list as ClientModel[])
      })
      .catch(err => {
        console.error(err)
        setClients([]) // fail safe
      })
  }

  const createClient = (client: CreateClientModel) => {
    axios
      .post('http://localhost:3000/clients', client)
      .then(() => {
        loadClients()
      })
      .catch(err => console.error(err))
  }

  const updateClient = (id: string, input: UpdateClientModel) => {
    axios
      .patch(`http://localhost:3000/clients/${id}`, input)
      .then(() => {
        loadClients()
      })
      .catch(err => console.error(err))
  }

  const deleteClient = (id: string) => {
    axios
      .delete(`http://localhost:3000/clients/${id}`)
      .then(() => {
        loadClients()
      })
      .catch(err => console.error(err))
  }

  return {
    clients,
    setClients,
    loadClients,
    createClient,
    updateClient,
    deleteClient,
  }
}
