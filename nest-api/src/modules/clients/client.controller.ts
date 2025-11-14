import { ClientService } from './client.service';
import {
  Get,
  Post,
  Controller,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateClientDto } from './dtos/createClient.dto';
import { UpdateClientDto } from './dtos/updateClient.dto';
import { CreateSellDto } from './dtos/createSell.dto';
import { AllClientsModel } from './models/allClients.model';
import { ClientModel } from './models/clients.model';
import { SellsEntity } from './entities/sells.entity';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  getClients(): Promise<AllClientsModel[]> {
    return this.clientService.getAllClients();
  }

  @Get('/byBook/:id')
  getClientsWhoBoughtBook(@Param('id') id: string): Promise<ClientModel[]> {
    return this.clientService.getClientsWhoBoughtBook(id);
  }

  @Get(':id')
  getClientById(@Param('id') id: string): Promise<ClientModel | null> {
    return this.clientService.getClientById(id);
  }

  @Post()
  createClient(@Body() createClientDto: CreateClientDto): Promise<ClientModel> {
    return this.clientService.createClient(createClientDto);
  }

  @Patch(':id')
  updateClient(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<ClientModel | undefined> {
    return this.clientService.editClient(updateClientDto, id);
  }

  @Delete(':id')
  deleteClient(@Param('id') id: string): Promise<void> {
    return this.clientService.deleteClient(id);
  }

  @Post('buyBook')
  sellBook(@Body() createSellDto: CreateSellDto): Promise<SellsEntity> {
    return this.clientService.sellBook(createSellDto);
  }
}
