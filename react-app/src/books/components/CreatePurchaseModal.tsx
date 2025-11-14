import { useEffect, useState } from 'react'
import type { PurchaseModel } from '../BookModel'
import { Button, Input, Modal, Select, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useBookPurshaseProviders } from '../providers/useBookPurshaseProvider'

interface CreateBookModalProps {
  onCreate: (purchase: PurchaseModel) => void
  bookId: string
}

export function CreateBookModal({ onCreate, bookId }: CreateBookModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState<number>(0)
  const [clientId, setClientId] = useState<string | undefined>(undefined)
  const { clients, loadClients } = useBookPurshaseProviders()

  const onClose = () => {
    setDate(0)
    setClientId(undefined)
    setIsOpen(false)
  }

  useEffect(() => {
    if (isOpen) {
      loadClients()
    }
  }, [isOpen, loadClients])

  return (
    <>
      <Button
        icon={<PlusOutlined />}
        type="primary"
        onClick={() => setIsOpen(true)}
      >
        Enregistrer un achat
      </Button>

      <Modal
        open={isOpen}
        onCancel={onClose}
        onOk={() => {
          if (!clientId || !date) return

          onCreate({
            date,
            bookId,
            clientId,
          })
          onClose()
        }}
        okButtonProps={{
          disabled: !clientId || !date,
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Select
            style={{ width: '100%' }}
            placeholder="Choisir un client"
            options={(clients ?? []).map(client => ({
              label: `${client.first_name} ${client.last_name}`,
              value: client.id,
            }))}
            value={clientId}
            onChange={value => setClientId(value)}
          />
          <Input
            type="number"
            placeholder="date"
            value={date}
            onChange={e => setDate(Number(e.target.value))}
          />
        </Space>
      </Modal>
    </>
  )
}
