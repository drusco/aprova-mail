import { Record } from './record.type';

export type Database = {
  users: Record[];
  messages: Record[];
  cities: Record[];
};
