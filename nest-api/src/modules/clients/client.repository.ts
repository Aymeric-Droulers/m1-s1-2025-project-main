import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity, ClientId } from './entities/client.entity';
import { DataSource, Repository } from 'typeorm';
import { ClientModel } from './models/clients.model';
import { CreateClientModel } from './models/createClient.model';
import { EditClientModel } from './models/editClient.model';
import { AllClientsModel } from './models/allClients.model';

@Injectable()
export class ClientRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
    private readonly dataSource: DataSource,
  ) {}

  public async getAllClients(): Promise<AllClientsModel[]> {
    return await this.clientRepository.find({
      relations: ['books_bought', 'books_bought.book'],
    });
  }

  public async getClientById(id: string): Promise<ClientEntity | null> {
    return await this.clientRepository.findOne({
      relations: ['books_bought', 'books_bought.book'],
      where: { id: id as ClientId },
    });
  }

  public async createClient(data: CreateClientModel): Promise<ClientModel> {
    const created: ClientEntity = await this.clientRepository.save(
      this.clientRepository.create(data),
    );
    return {
      ...created,
      books_bought: [],
    };
  }

  public async editClient(
    data: EditClientModel,
    id: string,
  ): Promise<ClientModel | undefined> {
    const clientExist: ClientEntity | null =
      await this.clientRepository.findOne({
        where: { id: id as ClientId },
      });
    if (!clientExist) {
      return undefined;
    }

    await this.clientRepository.update(id, data);
  }

  public async deleteClient(id: string): Promise<void> {
    await this.clientRepository.delete(id);
  }
}
