import { createFileRoute } from '@tanstack/react-router'
import React, { useState } from 'react'
import { Form, Input, Button, Card } from 'antd'
import { UserOutlined, MailOutlined, LinkOutlined } from '@ant-design/icons'

export const Route = createFileRoute('/ClientModel')({
  component: RouteComponent,
})

function RouteComponent() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      // Dans handleSubmit, changer :
      const body = { 
        first_name: values.first_name, 
        last_name: values.last_name, 
        mail: values.mail, 
        photo_link: values.photo_link || ''
      }
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      padding: '24px', 
      maxWidth: '500px', 
      margin: '0 auto',
      
    }}>
      <Card 
        title="Informations Client"
        style={{ 
          backgroundColor: '#808080',
          border: '2px solid #000',
          borderRadius: '8px',
        }}
        bodyStyle={{ 
          backgroundColor: '#808080',
          padding: '24px'
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
              { required: true, message: 'Veuillez saisir l\'email' },
              { type: 'email', message: 'Format d\'email invalide' }
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
            name="photoLink"
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
                fontWeight: 'bold'
              }}
            >
              Envoyer
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}