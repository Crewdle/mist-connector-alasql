import alasql from 'alasql';
export class AlaSqlQueryFileConnector {
    async executeQuery(fileContent, query, options) {
        const fileQuery = query.replace('FROM file', `FROM CSV(${fileContent}, {headers: ${options.headers}, separator: '${options.separator}', quote: '${options.quote}'})`);
        const result = await alasql.promise(fileQuery);
        return JSON.stringify(result);
    }
}
