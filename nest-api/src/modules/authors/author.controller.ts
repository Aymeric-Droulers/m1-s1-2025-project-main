import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto, UpdateAuthorDto } from './author.dto';
import { AuthorId } from './author.entity';
import { AuthorModel } from './author.model';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  getAllAuthors(): Promise<AuthorModel[]> {
    return this.authorService.getAllAuthors();
  }
  @Get(':id')
  public async getAuthorById(@Param('id') id: string): Promise<AuthorModel> {
    return this.authorService.getAuthorById(id as AuthorId);
  }


  @Post()
  public async createAuthor(@Body() createAuthorDto: CreateAuthorDto): Promise<AuthorModel> {
    return this.authorService.createAuthor(createAuthorDto);
  }

  @Patch(':id')
  public async updateAuthor(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Promise<AuthorModel> {
    return this.authorService.updateAuthor(id as AuthorId, updateAuthorDto);
  }

  @Delete(':id')
  public async removeAuthor(@Param('id') id: string): Promise<void> {
    return this.authorService.removeAuthor(id as AuthorId);
  }
}
