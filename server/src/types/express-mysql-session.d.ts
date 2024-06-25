declare module 'express-mysql-session' {
import session from 'express-session';

interface MySQLStoreOptions {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string;
    checkExpirationInterval?: number;
    expiration?: number;
    createDatabaseTable?: boolean;
    connectionLimit?: number;
    schema?: {
    tableName?: string;
    columnNames?: {
        session_id?: string;
        expires?: string;
        data?: string;
    };
    };
}

class MySQLStore extends session.Store {
    constructor(options: MySQLStoreOptions, connection?: any);
}
declare module 'express-session' {
    interface SessionData {
    user: { [key: string]: any };
    }
}
export = MySQLStore;
}