import { IQueryFileConnector, IQueryFileOptions } from '@crewdle/web-sdk-types';
export declare class AlaSqlQueryFileConnector implements IQueryFileConnector {
    executeQuery(fileContent: string, query: string, options: IQueryFileOptions): Promise<string>;
}
