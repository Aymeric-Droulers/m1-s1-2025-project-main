import { useState } from 'react'
import type { AuthorModel, UpdateAuthorModel } from '../AuthorModel'
import { Button, Col, Row, Popconfirm } from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { Link } from '@tanstack/react-router'
import { SafeImage } from '../../components/SafeImage'

interface AuthorListItemProps {
  author: AuthorModel
  onDelete: (id: string) => void
  onUpdate: (id: string, input: UpdateAuthorModel) => void
}

export function AuthorListItem({
  author,
  onDelete,
  onUpdate,
}: AuthorListItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [firstName, setFirstName] = useState(author.firstName)
  const [lastName, setLastName] = useState(author.lastName)
  const [pictureUrl, setPictureUrl] = useState(author.pictureUrl ?? '')

  const onValidateEdit = () => {
    onUpdate(author.id, { firstName, lastName, pictureUrl })
    setIsEditing(false)
  }

  const onCancelEdit = () => {
    setFirstName(author.firstName)
    setLastName(author.lastName)
    setPictureUrl(author.pictureUrl ?? '')
    setIsEditing(false)
  }

  return (
    <Row
      style={{
        width: '100%',
        height: '50px',
        borderRadius: '10px',
        backgroundColor: '#EEEEEE',
        margin: '1rem 0',
        padding: '.25rem',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Col span={10} style={{ margin: 'auto 0' }}>
        <SafeImage src={author.pictureUrl} size={32} />
        {isEditing ? (
          <>
            <input
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              style={{ marginRight: '.25rem' }}
            />
            <input
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
          </>
        ) : (
          <Link
            to={`/authors/$authorId`}
            params={{ authorId: author.id }}
            style={{ margin: 'auto 0', textAlign: 'left' }}
          >
            <span style={{ fontWeight: 'bold' }}>
              {author.firstName} {author.lastName}
            </span>
          </Link>
        )}
      </Col>

      <Col span={7} style={{ margin: 'auto 0' }}>
        Livres : <span style={{ fontWeight: 'bold' }}>{author.booksCount}</span>
        {' | '}
        Moy. ventes :{' '}
        <span style={{ fontWeight: 'bold' }}>
          {author.averageSalesPerBook.toFixed(2)}
        </span>
      </Col>

      <Col
        span={7}
        style={{
          margin: 'auto 0',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {isEditing ? (
          <>
            <Button type="primary" onClick={onValidateEdit}>
              <CheckOutlined />
            </Button>
            <Button onClick={onCancelEdit}>
              <CloseOutlined />
            </Button>
          </>
        ) : (
          <Button type="primary" onClick={() => setIsEditing(true)}>
            <EditOutlined />
          </Button>
        )}

        <Popconfirm
          title="Supprimer cet auteur ?"
          description={`« ${author.firstName} ${author.lastName} » sera définitivement supprimé.`}
          okText="Supprimer"
          cancelText="Annuler"
          okButtonProps={{ danger: true }}
          onConfirm={() => onDelete(author.id)}
        >
          <Button type="primary" danger>
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </Col>
    </Row>
  )
}
