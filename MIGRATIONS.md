# Database Migrations Guide

This project now uses Sequelize migrations instead of seeding scripts for database management. This provides better version control and safer database schema changes.

## Available Commands

### Migration Commands

```bash
# Run all pending migrations
npm run db:migrate

# Undo the last migration
npm run db:migrate:undo

# Undo all migrations
npm run db:migrate:undo:all

# Check migration status
npm run db:migrate:status

# Reset database (undo all + run all)
npm run db:reset
```

### Seeding Commands

```bash
# Run all seeders
npm run db:seed:all

# Undo all seeders
npm run db:seed:undo:all
```

## Initial Setup

1. **First time setup**: Run migrations to create all tables and seed basic data

   ```bash
   npm run db:migrate
   ```

2. **Reset database**: If you need to start fresh
   ```bash
   npm run db:reset
   ```

## Migration Files

The migrations are executed in this order:

1. `20241201000001-create-roles.js` - Creates roles table
2. `20241201000002-create-departments.js` - Creates departments table
3. `20241201000003-create-users.js` - Creates users table
4. `20241201000004-create-categories.js` - Creates categories table
5. `20241201000005-create-issues.js` - Creates issues table
6. `20241201000006-add-foreign-keys.js` - Adds all foreign key constraints
7. `20241201000007-seed-basic-data.js` - Seeds basic roles, departments, and categories
8. `20241201000008-create-admin-user.js` - Creates initial admin user

## Default Admin User

After running migrations, you'll have an admin user:

- **Email**: admin@jalsamadhan.gov.in
- **Password**: admin123
- **Role**: Admin (full system access)

## Adding New Migrations

To create a new migration:

```bash
npx sequelize-cli migration:generate --name migration-name
```

## Database Schema

The system creates these main tables:

- **roles** - User roles and permissions
- **departments** - Government departments
- **users** - All system users (citizens, supervisors, officers, admins)
- **categories** - Issue categories
- **issues** - Citizen reported issues

## Important Notes

- **Never modify existing migration files** - Create new ones instead
- **Always test migrations** on a copy of production data first
- **Backup your database** before running migrations in production
- The `sequelize.sync()` call has been removed from the application startup
- Tables are now created only through migrations

## Troubleshooting

If you encounter issues:

1. Check migration status: `npm run db:migrate:status`
2. Undo problematic migrations: `npm run db:migrate:undo`
3. Reset completely: `npm run db:reset`
4. Check the database logs for specific error messages
