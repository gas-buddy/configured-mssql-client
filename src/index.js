import assert from 'assert';
import mssql from 'mssql';

export default class MsSqlClient {
  constructor(context, opts) {
    assert(opts, 'configured-mqsql-client must be passed arguments');
    assert(opts.username, 'configured-mqsql-client missing username setting');
    assert(opts.password, 'configured-mqsql-client missing password setting');
    assert(opts.hostname, 'configured-mqsql-client missing hostname setting');

    // Translate to Tedious/mssql convention
    const sqlConfig = Object.assign({}, opts, {
      user: opts.username,
      server: opts.hostname,
    });

    if (context && context.logger && context.logger.info) {
      context.logger.info('Initializing MSSQL Server client', {
        user: sqlConfig.user,
        server: sqlConfig.server,
      });
    }

    this.db = new (mssql.Connection)(sqlConfig);
  }

  async start() {
    assert(!this.started, 'start called multiple times on configured-mqsql-client instance');
    this.started = true;
    await this.db.connect();
    return this.db;
  }

  stop() {
    assert(this.started, 'stop called multiple times on configured-mqsql-client instance');
    this.started = false;
    this.db.close();
    delete this.db;
  }
}
