import React, { useEffect, useState } from 'react'
import { Breadcrumb } from 'antd'
import type { BreadcrumbProps } from 'antd'
import { useRouterState } from '@tanstack/react-router'

export function AppBreadcrumb() {
  const { location } = useRouterState()
  const parts = location.pathname.split('/').filter(Boolean)
  const items2: BreadcrumbProps['items'] = []

  const [bookTitle, setBookTitle] = useState<string | null>(null)
  const [clientTitle, setClientTitle] = useState<string | null>(null)
  const [authorTitle, setAuthorTitle] = useState<string | null>(null)

  // 🔹 Fetch simple selon le type de page
  useEffect(() => {
    const segment = parts[0]
    const id = parts[1]

    // reset à chaque changement de path
    setBookTitle(null)
    setClientTitle(null)
    setAuthorTitle(null)

    if (!id) return

    // Livre
    if (segment === 'books') {
      fetch(`http://localhost:3000/books/${id}`)
        .then(res => {
          if (!res.ok) throw new Error()
          return res.json()
        })
        .then(data => {
          setBookTitle(data.title || null)
        })
        .catch(() => {
          setBookTitle(null)
        })
    }

    // Client
    if (segment === 'ClientModel') {
      fetch(`http://localhost:3000/clients/${id}`)
        .then(res => {
          if (!res.ok) throw new Error()
          return res.json()
        })
        .then(data => {
          setClientTitle(data.mail || null)
        })
        .catch(() => {
          setClientTitle(null)
        })
    }

    // Auteur
    if (segment === 'authors') {
      fetch(`http://localhost:3000/authors/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error()
          return res.json()
        })
        .then((data) => {
          const fullName =
            data.firstName && data.lastName
              ? `${data.firstName} ${data.lastName}`
              : data.firstName || data.lastName || null
          setAuthorTitle(fullName)
        })
        .catch(() => {
          setAuthorTitle(null)
        })
    }
  }, [location.pathname, parts]) // on relance dès que l’URL change

  // 🔹 Construction du breadcrumb

  if (parts[0] === 'books') {
    items2.push({ title: <a href="/books">Books</a> })
    if (parts.length > 1) {
      const id = parts[1]
      items2.push({
        title: <a href={`/books/${id}`}>{bookTitle ?? 'Détails du livre'}</a>,
      })
    }
  }

  if (parts[0] === 'client' || parts[0] === 'listeClient') {
    items2.push({ title: <a href="/listeClient">Clients</a> })
    if (parts.length > 1) {
      const id = parts[1]
      items2.push({
        title: (
          <a href={`/client/${id}`}>{clientTitle ?? 'Détails du client'}</a>
        ),
      })
    }
  }

  if (parts[0] === 'authors') {
    items2.push({ title: <a href="/authors">Authors</a> })
    if (parts.length > 1) {
      const id = parts[1]
      items2.push({
        title: (
          <a href={`/authors/${id}`}>{authorTitle ?? 'Détails de l’auteur'}</a>
        ),
      })
    }
  }

  return <Breadcrumb separator=">" items={items2} />
}
