import { ClientModel } from './models/clients.model';
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

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  getClients(): Promise<ClientModel[]> {
    return this.clientService.getAllClients();
  }

  @Get(':id')
  getClientById(@Param('id') id: string) {
    return this.clientService.getClientById(id);
  }

  @Post()
  createClient(@Body() createClientDto: CreateClientDto) {
    return this.clientService.createClient(createClientDto);
  }

  @Patch(':id')
  updateClient(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientService.editClient(updateClientDto, id);
  }

  @Delete(':id')
  deleteClient(@Param('id') id: string) {
    return this.clientService.deleteClient(id);
  }

  @Post('buyBook')
  sellBook(@Body() createSellDto: CreateSellDto) {
    return this.clientService.sellBook(createSellDto);
  }
}
