import fs from 'fs';
import path from 'path';

export type Credentials = {
  username: string;
  password: string;
};

const credentialsPath = path.join(__dirname, '..', 'tests', 'resources', 'credential.json');

export const credentials: Credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
