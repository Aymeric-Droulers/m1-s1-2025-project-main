import { SellsEntity } from '../entities/sells.entity';

export type ClientModel = {
  id: string;
  first_name: string;
  last_name: string;
  mail: string;
  photo_link: string;
  books_bought?: SellsEntity[];
};
