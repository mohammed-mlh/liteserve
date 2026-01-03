import { QueryExecResult, Database } from 'sql.js';
import * as fs from 'fs';

/**
 * Converts sql.js query results into an array of objects
 * @param result - The result from db.exec() which has format: [{ columns: string[], values: any[][] }]
 * @returns Array of objects where keys are column names and values are row values
 */
export function rowsToObjects(result: QueryExecResult[]): any[] {
  if (result.length === 0) {
    return [];
  }

  return result[0].values.map((row: any[]) => {
    const obj: any = {};
    result[0].columns.forEach((col: string, i: number) => {
      obj[col] = row[i];
    });
    return obj;
  });
}

/**
 * Saves the in-memory database to a file on disk
 * @param db - The sql.js Database instance
 * @param filePath - The path where the database file should be saved
 */
export function saveDatabase(db: Database, filePath: string): void {
  // db.export() returns the database as a Uint8Array (binary data)
  const data = db.export();
  // Convert Uint8Array to Node.js Buffer for file writing
  const buffer = Buffer.from(data);
  // Write the database buffer to the SQLite file on disk
  fs.writeFileSync(filePath, buffer);
}

