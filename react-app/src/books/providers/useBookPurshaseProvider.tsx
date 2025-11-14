import { useState } from 'react'
import type { BookModel } from '../BookModel'

import axios from 'axios'
type Client = {
  id: string
  first_name: string
  last_name: string
  mail: string
  photo_link: string
  books_bought: any[]
  nb_books_bought: number
}

export const useBookPurshaseProviders = () => {
  const [clients, setClients] = useState<Client[]>([])
  //const [clients, setClients] = useState<BookModel['clients'][]>([])

  const loadClients = () => {
    axios
      .get('http://localhost:3000/clients')
      .then(data => {
        setClients(data.data)
      })
      .catch(err => console.error(err))
  }

  return { clients, loadClients }
}
