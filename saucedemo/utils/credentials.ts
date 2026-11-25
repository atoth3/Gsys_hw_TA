import fs from 'fs';
import path from 'path';

export type Credentials = {
  username: string;
  password: string;
};

const credentialsPath = path.join(__dirname, '..', 'credentials.json');

/** Login credentials read from credentials.json in the project root. */
export const credentials: Credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
