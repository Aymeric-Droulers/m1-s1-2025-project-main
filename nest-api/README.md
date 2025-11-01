# Endpoints
## Clients

| Methode | /Route                      | Retour                                             |
|---------|-----------------------------|----------------------------------------------------|
| GET     | /clients                    | list de tous les clients  (Client+nb_books_bought) |
| GET     | /clients/:clientId          | un client en particulier  (Client)                 |
| PATCH   | /clients/:clientId          | modifie un client                                  |
| DELETE  | /clients/:clientId          | supprime un client                                 |
| POST    | /clients                    | ajoute un client                                   |
| GET     | /clients/:clientId/bookList | renvoie la liste des livres achetés par le client  |
 | POST    | /clients/buyBook            | vend un livre à un client                          |
    



# Datamodels

```
Client{
    id: String
    first_name: String
    last_name: String
    mail: String
    photoLink: String
    booksBought: BookModel[]
}
```