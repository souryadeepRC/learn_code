---
name: run-database-migration
description: Safe step-by-step process for Prisma schema changes in the multi-schema setup
---

# Playbook: Run Database Migration

Use this playbook when tasked with updating the Prisma schema or migrating the database.

> **Note on MongoDB**: Prisma uses `db push` instead of `migrate dev` for MongoDB since it's document-based.

## Step 1: Identify Target Schema
Determine which schema is being modified:
- Users: `prisma/users/users.schema.prisma`
- Technologies: `prisma/technologies/technologies.schema.prisma`

## Step 2: Update Schema File
- Make the requested modifications to the `.prisma` file.
- Ensure all new models have `@id @default(auto()) @map("_id") @db.ObjectId` as the primary key.
- Verify cross-database relationships are modeled correctly (e.g., using `String[]` for cross-DB IDs).

## Step 3: Push Schema to Database
Execute the `db push` command for the specific schema:
```bash
npx prisma db push --schema=./prisma/[schema-dir]/[schema-file].prisma
```

## Step 4: Generate Client
Execute the corresponding npm script defined in `package.json` to generate the custom Prisma client:
- `npm run prisma:generate:users`
- `npm run prisma:generate:technologies`

## Step 5: Update Application Code
- Update any API routes or services to reflect the schema changes.
- Ensure Zod validation schemas are updated to match the new database structure.
