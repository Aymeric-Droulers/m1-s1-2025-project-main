import { createFileRoute } from '@tanstack/react-router'
import React, { useState } from 'react'

export const Route = createFileRoute('/ClientModel')({
  component: RouteComponent,
})

function RouteComponent() {
  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [mail, setEmail] = useState('')
  const [photoLink, setPhotoLink] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Envoi des données au backend (Nest) pour création du client
    try {
      const body = { first_name, last_name, mail, photoLink }
      const res = await fetch('http://localhost:3000/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const text = await res.text()
        console.error('Erreur création client:', text)
        alert('Erreur lors de la création du client')
        return
      }

      const created = await res.json()
      console.log('Client créé:', created)
      // Redirection vers la liste des clients
      window.location.href = '/listeClient'
    } catch (err) {
      console.error('Erreur réseau:', err)
      alert('Erreur réseau lors de la création du client')
    }
  }

  return (
    <div>
      <h2>Informations Client</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Prenom : </label>
          <input
            type="text"
            id="first_name"
            value={first_name}
            onChange={e => setFirstName(e.target.value)}
            className="first-name-input"
            required
          />
        </div>
        <div>
          <label>Nom : </label>
          <input
            type="text"
            id="last_name"
            value={last_name}
            onChange={e => setLastName(e.target.value)}
            className="last-name-input"
            required
          />
        </div>

        <div>
          <label>Email : </label>
          <input
            type="email"
            id="mail"
            value={mail}
            onChange={e => setEmail(e.target.value)}
            className="email-input"
            required
          />
        </div>

        <button type="submit" className="boutton-submit">
          Envoyer
        </button>
      </form>
    </div>
  )
}
