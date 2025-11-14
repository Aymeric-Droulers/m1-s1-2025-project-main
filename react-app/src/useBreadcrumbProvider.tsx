import { useEffect, useState } from 'react'
import type { BreadcrumbProps } from 'antd'
import axios from 'axios'
import { useRouterState } from '@tanstack/react-router'

export const useBreadcrumbProvider = () => {
  const { location } = useRouterState()
  const [items, setItems] = useState<BreadcrumbProps['items']>([])

  useEffect(() => {
    const parts = location.pathname.split('/').filter(Boolean)
    const segment = parts[0]
    const id = parts[1]

    if (!segment) {
      setItems([])
      return
    }

    const baseItems: BreadcrumbProps['items'] = []

    if (segment === 'books') {
      baseItems.push({ title: <a href="/books">Books</a> })
    }

    if (segment === 'client' || segment === 'clients') {
      baseItems.push({ title: <a href="/clients">Clients</a> })
    }

    if (segment === 'authors') {
      baseItems.push({ title: <a href="/authors">Authors</a> })
    }

    // Si pas d'id on s'arrête là
    if (!id) {
      setItems(baseItems)
      return
    }

    //on va chercher le titre à partir de l'id
    if (segment === 'books') {
      axios
        .get(`http://localhost:3000/books/${id}`)
        .then(res => {
          const data = res.data
          const title = data?.title ?? 'Détails du livre'
          setItems([
            ...baseItems,
            {
              title: <a href={`/books/${id}`}>{title}</a>,
            },
          ])
        })
        .catch(err => {
          console.error(err)
          // fallback
          setItems([
            ...baseItems,
            {
              title: <a href={`/books/${id}`}>Détails du livre</a>,
            },
          ])
        })
      return
    }

    if (segment === 'clients') {
      axios
        .get(`http://localhost:3000/clients/${id}`)
        .then(res => {
          const data = res.data
          const title = data?.first_name ?? 'Détails du client'
          setItems([
            ...baseItems,
            {
              title: <a href={`/client/${id}`}>{title}</a>,
            },
          ])
        })
        .catch(err => {
          console.error(err)
          setItems([
            ...baseItems,
            {
              title: <a href={`/client/${id}`}>Détails du client</a>,
            },
          ])
        })
      return
    }

    if (segment === 'authors') {
      axios
        .get(`http://localhost:3000/authors/${id}`)
        .then(res => {
          const data = res.data
          const fullName =
            data?.firstName && data?.lastName
              ? `${data.firstName} ${data.lastName}`
              : data?.firstName || data?.lastName || 'Détails de l’auteur'

          setItems([
            ...baseItems,
            {
              title: <a href={`/authors/${id}`}>{fullName}</a>,
            },
          ])
        })
        .catch(err => {
          console.error(err)
          setItems([
            ...baseItems,
            {
              title: <a href={`/authors/${id}`}>Détails de l’auteur</a>,
            },
          ])
        })
      return
    }

    // Si on tombe sur une page non prévue
    setItems(baseItems)
  }, [location.pathname])
  return { items }
}
