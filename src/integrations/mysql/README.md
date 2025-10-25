# MySQL Integration

To use the MySQL integration via `mysql2`, configure a `.env` file at the project root with your database password:

```
MYSQL_PASSWORD=your_mysql_password_here
```

This will be automatically used by `src/integrations/mysql/index.ts` for connecting to the MySQL database (localhost, db: enginedb, user: enginedb).
