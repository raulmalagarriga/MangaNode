const { Client } = require('pg');

const connectionData = {
    user: 'postgres',
    host: 'Localhost',
    database: 'mangaReaderNode',
    password: 'password',
    port: 5432,
  }
  const client = new Client(connectionData)