import alasql from 'alasql';
import Papa from 'papaparse';

import { IQueryFileConnector, IQueryFileOptions } from '@crewdle/web-sdk-types';

export class AlaSqlQueryFileConnector implements IQueryFileConnector {
  async executeQuery(fileContent: string, query: string, options: IQueryFileOptions): Promise<string> {
    const parsedContent = Papa.parse<any>(fileContent, { header: true });
    const data: Record<string, any>[] = [];
    for (const row of parsedContent.data) {
      const newRow: Record<string, string | number> = {};
      for (const key in row) {
        if (!isNaN(Number(row[key]))) {
          newRow[key] = Number(row[key]);
        } else {
          newRow[key] = row[key];
        }
      }
      data.push(newRow);
    }

    if (data.length === 0) {
      throw new Error('No data found in the file');
    }

    const headers = Object.keys(data[0]);
    const columns = headers.map((header) => `${header} ${typeof data[0][header] === 'string' ? 'STRING' : 'INT'}`);

    alasql(`DROP TABLE IF EXISTS file`);
    alasql(`CREATE TABLE file (${columns.join(', ')})`);
    alasql.tables.file.data = data;

    const result = alasql(query);

    alasql(`DROP TABLE file`);

    return JSON.stringify(result);
  }
}
