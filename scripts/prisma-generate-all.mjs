#!/usr/bin/env node
// Discovers every prisma/**/*.schema.prisma file and runs `prisma generate`
// against each. New domains just need a schema file — no package.json edit.

import { execFileSync } from 'node:child_process';
import { globSync } from 'node:fs';
import path from 'node:path';

const schemas = globSync('prisma/**/*.schema.prisma').sort();

if (schemas.length === 0) {
  console.error('No prisma schema files found under prisma/**/*.schema.prisma');
  process.exit(1);
}

for (const schema of schemas) {
  const relative = path.relative(process.cwd(), schema);
  console.log(`\n> prisma generate --schema=${relative}`);
  execFileSync('npx', ['prisma', 'generate', `--schema=${relative}`], {
    stdio: 'inherit',
  });
}

console.log(`\nGenerated ${schemas.length} Prisma client(s).`);

// "prisma:generate:users": "prisma generate --schema=./prisma/users/users.schema.prisma",
// "prisma:generate:technologies": "prisma generate --schema=./prisma/technologies/technologies.schema.prisma",
// "prisma:generate:notes": "prisma generate --schema=./prisma/notes/notes.schema.prisma",
// "prisma:generate:quizzes": "prisma generate --schema=./prisma/quizzes/quizzes.schema.prisma",
// "prisma:generate:challenges": "prisma generate --schema=./prisma/challenges/challenges.schema.prisma",
// "prisma:generate:learningPaths": "prisma generate --schema=./prisma/learningPaths/learningPaths.schema.prisma",
// "prisma:generate:progress": "prisma generate --schema=./prisma/progress/progress.schema.prisma",
