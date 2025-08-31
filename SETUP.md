# Quick Setup Guide

## 1. Create Environment File

Copy `env.example` to `.env` and fill in your database details:

```bash
cp env.example .env
```

Edit `.env` with your actual database credentials:

```env
DB_USERNAME=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_NAME=jal_samadhan
DB_HOST=localhost
DB_PORT=5432
DB_SSL=false
```

## 2. Create Database

Create a PostgreSQL database named `jal_samadhan`:

```sql
CREATE DATABASE jal_samadhan;
```

## 3. Run Migrations

```bash
npm run db:migrate
```

## 4. Start Application

```bash
npm run dev
```

## Troubleshooting

### If you get "dialect not supported" error:

- Make sure your `.env` file has the correct database credentials
- Check that PostgreSQL is running
- Verify the database exists

### If you get connection errors:

- Check your database credentials in `.env`
- Ensure PostgreSQL is running on the specified port
- Try connecting with `psql` to verify credentials

### If migrations fail:

- Check the error message for specific issues
- You can reset with: `npm run db:reset`

## Default Admin User

After successful migration, you'll have:

- **Email**: admin@jalsamadhan.gov.in
- **Password**: (temporary - needs to be changed)
- **Role**: Admin

## Next Steps

1. Change the admin password after first login
2. Customize the seeded data as needed
3. Add your own categories and departments
