import tap from 'tap';
import mssql from 'mssql';
import winston from 'winston';
import MsSqlClient from '../src/index';

tap.test('test_connection', async (t) => {
  const config = {
    name: 'test-db',
    hostname: process.env.MSSQLHOST || 'localhost',
    username: process.env.MSSQLUSER || 'developer',
    password: process.env.MSSQLPASSWORD || 'password',
  };

  const conn = new MsSqlClient(winston, config);
  const db = await conn.start();
  t.ok(db, 'Should return a db client');
  const one = await new mssql.Request(db).query('SELECT 1 as one;');
  t.deepEquals(one, [{ one: 1 }], 'Should return 1');
  await conn.stop();
});
