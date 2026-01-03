import { type QueryResult } from '../types';

export function logger(query: QueryResult) {
  const ts = new Date().toISOString();
  const status = query.success ? 'SUCCESS' : 'FAIL';
  const baseInfo = `[${ts}] [${query.type.toUpperCase()}][${status}]`;
  const details: string[] = [
    `Query: ${query.query}`,
    `Execution Time: ${query.executionTime}ms`
  ];
  if (query.rowsAffected !== undefined) details.push(`Rows Affected: ${query.rowsAffected}`);
  if (query.lastInsertRowid !== undefined) details.push(`Last Insert RowID: ${query.lastInsertRowid}`);
  if (query.error) details.push(`Error: ${query.error}`);

  console.log(`${baseInfo}\n  ${details.join('\n  ')}`);
}

// test the logger
const query: QueryResult = {
  query: 'SELECT * FROM users',
  type: 'read',
  executionTime: 100,
  success: true,
  rowsAffected: 1,
  lastInsertRowid: 1,
}
logger(query);