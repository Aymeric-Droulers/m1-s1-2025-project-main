import { Injectable } from '@nestjs/common';
import { ClientRepository } from './client.repository';
import { ClientModel } from './models/clients.model';
import { CreateClientModel } from './models/createClient.model';
import { EditClientModel } from './models/editClient.model';
import { SellsRepository } from './sells.repository';
import { CreateSellModel } from './models/createSell.model';
import { AllClientsModel } from './models/allClients.model';
import { ClientEntity } from './entities/client.entity';
import { SellsEntity } from './entities/sells.entity';
import { BookModel } from '../books/book.model';

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly sellsRepository: SellsRepository,
  ) {}

  private clientEntityListToClientModelList(
    listEntity: ClientEntity[] | AllClientsModel[],
  ): ClientModel[] {
    return listEntity.map((c: ClientEntity) => ({
      ...c,
      books_bought: c.books_bought
        ?.filter((s) => !!s.book && !!s.book.author)
        .map((s) => ({
          id: s.book.id,
          title: s.book.title,
          description: s.book.description,
          pictureUrl: s.book.pictureUrl,
          yearPublished: s.book.yearPublished,
          author: s.book.author!,
        })) as BookModel[],
      nb_books_bought: c.books_bought.length,
    }));
  }

  public async getAllClients(): Promise<AllClientsModel[]> {
    const clients: AllClientsModel[] =
      await this.clientRepository.getAllClients();

    return this.clientEntityListToClientModelList(clients);
  }

  public async getClientById(id: string): Promise<ClientModel | null> {
    const client: ClientEntity | null =
      await this.clientRepository.getClientById(id);
    if (client == null) {
      return null;
    }
    return {
      ...client,
      books_bought: client.books_bought
        ?.filter((s: SellsEntity) => s.book && s.book.author)
        .map((s: SellsEntity) => ({
          id: s.book.id,
          title: s.book.title,
          description: s.book.description,
          pictureUrl: s.book.pictureUrl,
          yearPublished: s.book.yearPublished,
          author: {
            id: s.book.author!.id,
            firstName: s.book.author!.firstName,
            lastName: s.book.author!.lastName,
          },
        })),
    };
  }

  public async createClient(data: CreateClientModel): Promise<ClientModel> {
    return this.clientRepository.createClient(data);
  }

  public async editClient(
    data: EditClientModel,
    id: string,
  ): Promise<ClientModel | undefined> {
    return this.clientRepository.editClient(data, id);
  }

  public async deleteClient(id: string): Promise<void> {
    return this.clientRepository.deleteClient(id);
  }

  public async sellBook(data: CreateSellModel): Promise<SellsEntity> {
    return this.sellsRepository.createSell(data);
  }

  public async getClientsWhoBoughtBook(bookId: string): Promise<ClientModel[]> {
    const sells: SellsEntity[] =
      await this.sellsRepository.getSellsByBookId(bookId);
    const clientsList: ClientEntity[] = sells.map(
      (sell: SellsEntity) => sell.client,
    );

    return this.clientEntityListToClientModelList(clientsList);
  }
}
