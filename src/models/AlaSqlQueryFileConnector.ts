import alasql from 'alasql';

import { IQueryFileConnector, IQueryFileOptions } from '@crewdle/web-sdk-types';

export class AlaSqlQueryFileConnector implements IQueryFileConnector {
  async executeQuery(fileContent: string, query: string, options: IQueryFileOptions): Promise<string> {
    const fileQuery = query.replace('FROM file', `FROM CSV(${fileContent}, {headers: ${options.headers}, separator: '${options.separator}', quote: '${options.quote}'})`);
    const result = await alasql.promise(fileQuery);

    return JSON.stringify(result);
  }
}
