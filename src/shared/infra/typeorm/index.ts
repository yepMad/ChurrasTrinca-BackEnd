import { createConnections } from 'typeorm';
import { types } from 'pg';

types.setTypeParser(types.builtins.NUMERIC, (value: string): number =>
  parseFloat(value),
);

createConnections();
