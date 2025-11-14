import { useEffect, useState } from 'react'
import type { CreateClientModel } from '../ClientModel'
import { Button, Card, Form, Input, message, Modal, Select, Space } from 'antd'
import {
  LinkOutlined,
  MailOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useClientAuthorsProviders } from '../providers/useClientAuthorsProviders'

interface CreateClientModalProps {
  onCreate: (Client: CreateClientModel) => void
}

export function CreateClientModal({ onCreate }: CreateClientModalProps) {
  const [form] = Form.useForm()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const onClose = () => {
    setIsOpen(false)
  }

  /**
   * Fonction de soumission du formulaire
   * Envoie les données à l'API puis redirige vers la liste des clients
   * @param values - Les valeurs du formulaire validées
   */
  const handleSubmit = async (values: ClientFormValues): Promise<void> => {
    setLoading(true)
    try {
      // Préparation des données à envoyer (avec photo_link vide si non fournie)
      const body = {
        first_name: values.first_name,
        last_name: values.last_name,
        mail: values.mail,
        photo_link: values.photo_link || '',
      }

      // Envoi de la requête POST à l'API pour créer le client
      const res: Response = await fetch('http://localhost:3000/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      // Gestion des erreurs de réponse
      if (!res.ok) {
        const text: string = await res.text()
        console.error('Erreur création client:', text)
        message.error('Erreur lors de la création du client')
        return
      }



      // Succès : affichage du message et redirection vers la liste
      const created = await res.json()
      console.log('Client créé:', created)
      message.success('Client créé avec succès')
    } catch (err) {
      // Gestion des erreurs réseau
      console.error('Erreur réseau:', err)
      message.error('Erreur réseau lors de la création du client')
    } finally {
      // Désactivation du spinner dans tous les cas
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        icon={<PlusOutlined />}
        type="primary"
        onClick={() => setIsOpen(true)}
      >
        Create Client
      </Button>
      <Modal
        open={isOpen}
        onCancel={onClose}
        onOk={() => {
          onCreate({
            title,
            yearPublished,
            authorId: '4540d533-3100-445a-8796-ab5dfd9a3240',
          })
          onClose()
        }}
        okButtonProps={{
          disabled: !authorId || !title?.length || !yearPublished,
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          return (
          <div style={{ padding: '24px', maxWidth: '500px', margin: '0 auto' }}>
            {/* Carte contenant le formulaire de création */}
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
              {/* Formulaire avec validation Ant Design */}
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                autoComplete="off"
                style={{ backgroundColor: '#808080' }}
              >
                {/* Champ Prénom - obligatoire */}
                <Form.Item
                  label="Prénom"
                  name="first_name"
                  rules={[
                    { required: true, message: 'Veuillez saisir le prénom' },
                  ]}
                  style={{ marginBottom: 16 }}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Saisir le prénom"
                    style={{ backgroundColor: 'white' }}
                  />
                </Form.Item>

                {/* Champ Nom - obligatoire */}
                <Form.Item
                  label="Nom"
                  name="last_name"
                  rules={[
                    { required: true, message: 'Veuillez saisir le nom' },
                  ]}
                  style={{ marginBottom: 16 }}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Saisir le nom"
                    style={{ backgroundColor: 'white' }}
                  />
                </Form.Item>

                {/* Champ Email - obligatoire avec validation du format */}
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

                {/* Champ Lien photo - facultatif */}
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

                {/* Bouton de soumission avec spinner pendant le chargement */}
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
        </Space>
      </Modal>
    </>
  )
}
