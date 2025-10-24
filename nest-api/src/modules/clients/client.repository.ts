import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity, ClientId } from './entities/client.entity';
import { DataSource, Repository } from 'typeorm';
import { ClientModel } from './models/clients.model';
import { CreateClientModel } from './models/createClient.model';
import { EditClientModel } from './models/editClient.model';

@Injectable()
export class ClientRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
    private readonly dataSource: DataSource,
  ) {}

  public async getAllClients(): Promise<ClientModel[]> {
    return await this.clientRepository.find();
  }

  public async getClientById(id: string): Promise<ClientModel | null> {
    return await this.clientRepository.findOne({
      where: { id: id as ClientId },
    });
  }

  public async createClient(data: CreateClientModel): Promise<ClientModel> {
    return this.clientRepository.save(this.clientRepository.create(data));
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
}
