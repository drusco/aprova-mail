import { Injectable } from '@nestjs/common';
import { JSONFile, Low } from 'lowdb';
import { Database } from '../types/database.type';
import { Record } from '../types/record.type';
import { RecordFilter } from '../types/record.filter.type';
import { v1 as uuidv1 } from 'uuid';
import databaseSample from '../database.sample';

@Injectable()
export class LowdbService {
  private db;

  constructor() {
    this.init();
  }

  private async init() {
    const adapter = new JSONFile<Database>('database.json');
    this.db = new Low<Database>(adapter);
    this.db.data ||= databaseSample;
    await this.db.write();
  }

  public async add(
    collection: string,
    value: any,
  ): Promise<undefined | string> {
    const records = this.get(collection);
    if (!records) return;
    const uuid = uuidv1();
    records.push(<Record>{
      uuid,
      value,
      created: Date.now(),
      updated: null,
    });
    await this.db.write();
    return uuid;
  }

  public async findOne(
    collection: string,
    filters: any = undefined,
  ): Promise<undefined | Record> {
    const records = await this.find(collection, filters);
    if (!records) return;
    return records[0];
  }

  public async find(
    collection: string,
    filters: undefined | RecordFilter = undefined,
    sort: undefined | ((a: Record, b: Record) => number) = undefined,
  ): Promise<undefined | Record[]> {
    let records = this.get(collection);
    if (!records) return;
    if (filters) {
      const filteredRecords = [];
      for (let x = 0; x < records.length; x++) {
        const row = records[x];
        if ((await filters(row)) === true) {
          filteredRecords.push(row);
        }
      }
      records = filteredRecords;
    }
    if (sort) records.sort(sort);
    return records;
  }

  public async findById(
    collection: string,
    uuid: string,
  ): Promise<undefined | Record> {
    return await this.findOne(collection, (row) => row.uuid === uuid);
  }

  public async update(
    collection: string,
    uuid: string,
    value: any,
  ): Promise<boolean> {
    const record = await this.findById(collection, uuid);
    if (!record) return false;
    record.value = value;
    record.updated = Date.now();
    await this.db.write();
    return true;
  }

  public async delete(collection: string, uuid: string): Promise<boolean> {
    const item = await this.findById(collection, uuid);
    if (!item) return false;
    const records = this.get(collection);
    records.splice(records.indexOf(item), 1);
    await this.db.write();
    return true;
  }

  private get(collection: string): undefined | Record[] {
    if (!Array.isArray(this.db.data[collection])) return;
    return this.db.data[collection];
  }
}
