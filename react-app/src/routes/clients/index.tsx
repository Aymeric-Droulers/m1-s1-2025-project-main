/**
 * Page listant tous les clients
 * Affiche la liste des clients avec possibilité de les consulter, créer ou supprimer
 * Charge les données depuis l'API au montage du composant
 */

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ClientsPage } from '../../clients/pages/ClientsPage.tsx'
import type { ClientModel } from '../../clients/ClientModel.tsx'

// Configuration de la route pour la liste des clients
export const Route = createFileRoute('/clients/')({
  component: ClientsPage,
})



// Données initiales par défaut (avant chargement de l'API)
const initialClients: ClientModel[] = [
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

