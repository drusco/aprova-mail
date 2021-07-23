import { Record } from './record.type';

export type RecordFilter = (row: Record) => boolean | Promise<boolean>;
