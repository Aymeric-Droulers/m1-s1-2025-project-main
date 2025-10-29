import { Injectable } from '@nestjs/common';
import { ClientRepository } from './client.repository';
import { ClientModel } from './models/clients.model';
import { CreateClientModel } from './models/createClient.model';
import { EditClientModel } from './models/editClient.model';
import { SellsRepository } from './sells.repository';
import { CreateSellModel } from './models/createSell.model';

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly sellsRepository: SellsRepository,
  ) {}

  public async getAllClients(): Promise<ClientModel[]> {
    return this.clientRepository.getAllClients();
  }

  public async getClientById(id: string): Promise<ClientModel | null> {
    return this.clientRepository.getClientById(id);
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

  public async sellBook(data: CreateSellModel) {
    return this.sellsRepository.createSell(data);
  }
}
