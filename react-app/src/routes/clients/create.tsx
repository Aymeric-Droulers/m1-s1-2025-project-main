import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, type JSX } from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, MailOutlined, LinkOutlined } from '@ant-design/icons'

export const Route = createFileRoute('/clients/create')({
  component: CreateClient,
})

interface ClientFormValues {
  first_name: string
  last_name: string
  mail: string
  photo_link?: string
}

function CreateClient(): JSX.Element {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleSubmit = async (values: ClientFormValues): Promise<void> => {
    setLoading(true)
    try {
      const body = {
        first_name: values.first_name,
        last_name: values.last_name,
        mail: values.mail,
        photo_link: values.photo_link || '',
      }

      const res: Response = await fetch('http://localhost:3000/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const text: string = await res.text()
        console.error('Erreur création client:', text)
        message.error('Erreur lors de la création du client')
        return
      }

      const created = await res.json()
      console.log('Client créé:', created)
      message.success('Client créé avec succès')
      navigate({ to: '/clients' })
    } catch (err) {
      console.error('Erreur réseau:', err)
      message.error('Erreur réseau lors de la création du client')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '500px', margin: '0 auto' }}>
      <Card
        title="Créer un Client"
        style={{
          backgroundColor: '#808080',
          border: '2px solid #000',
          borderRadius: '8px',
        }}
        bodyStyle={{
          backgroundColor: '#808080',
          padding: '24px',
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          style={{ backgroundColor: '#808080' }}
        >
          <Form.Item
            label="Prénom"
            name="first_name"
            rules={[{ required: true, message: 'Veuillez saisir le prénom' }]}
            style={{ marginBottom: 16 }}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Saisir le prénom"
              style={{ backgroundColor: 'white' }}
            />
          </Form.Item>

          <Form.Item
            label="Nom"
            name="last_name"
            rules={[{ required: true, message: 'Veuillez saisir le nom' }]}
            style={{ marginBottom: 16 }}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Saisir le nom"
              style={{ backgroundColor: 'white' }}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="mail"
            rules={[
              { required: true, message: "Veuillez saisir l'email" },
              { type: 'email', message: "Format d'email invalide" },
            ]}
            style={{ marginBottom: 16 }}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Saisir l'email"
              style={{ backgroundColor: 'white' }}
            />
          </Form.Item>

          <Form.Item
            label="Lien de la photo (facultatif)"
            name="photo_link"
            style={{ marginBottom: 24 }}
          >
            <Input
              prefix={<LinkOutlined />}
              placeholder="https://example.com/photo.jpg"
              style={{ backgroundColor: 'white' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                width: '100%',
                height: '40px',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              Créer le client
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
