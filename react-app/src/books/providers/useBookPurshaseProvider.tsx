import { useState } from 'react'
import type { ClientModel } from '../../clients/ClientModel.tsx'
import axios from 'axios'

export const useBookPurshaseProviders = () => {
  const [ClientModel, setClients] = useState<ClientModel[]>([])
  const loadClients = () => {
    axios
      .get('http://localhost:3000/clients')
      .then(data => {
        setClients(data.data)
      })
      .catch(err => console.error(err))
  }

  return { ClientModel, loadClients }
}
