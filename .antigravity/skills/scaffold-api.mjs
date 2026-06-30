import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '../../');

const routePath = process.argv[2];

if (!routePath) {
  console.error('\n❌ Error: Please provide a route path.');
  console.log('Usage: node scaffold-api.mjs <route-path>');
  console.log('Example: node scaffold-api.mjs users/profile\n');
  process.exit(1);
}

// Clean up route path (remove leading/trailing slashes)
const cleanRoutePath = routePath.replace(/^\/+|\/+$/g, '');
const fullDirPath = path.join(projectRoot, 'src/app/api', cleanRoutePath);
const filePath = path.join(fullDirPath, 'route.ts');

if (fs.existsSync(filePath)) {
  console.error(`\n❌ Error: Route already exists at src/app/api/${cleanRoutePath}/route.ts\n`);
  process.exit(1);
}

// Create directories recursively
fs.mkdirSync(fullDirPath, { recursive: true });

// Boilerplate template
const routeTemplate = `import { NextRequest } from 'next/server';
import { z } from 'zod';
import { APIResponse } from '@/utils/api';
import { HTTP_STATUS } from '@/constants/api';

// 1. Define Request Validation Schema
const RequestSchema = z.object({
  // exampleField: z.string().min(1, "Field is required"),
});

/**
 * POST /api/${cleanRoutePath}
 * Description: TODO: Add description
 */
export async function POST(req: NextRequest) {
  try {
    // 2. Parse and Validate Request
    const body = await req.json().catch(() => null);
    if (!body) {
      return APIResponse.send(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Invalid JSON payload',
        code: 'INVALID_JSON',
      });
    }

    const validatedData = RequestSchema.safeParse(body);
    if (!validatedData.success) {
      return APIResponse.send(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors: validatedData.error.flatten().fieldErrors,
      });
    }

    const data = validatedData.data;

    // 3. TODO: Execute Business Logic (Move complex logic to a service)
    // const result = await someService(data);
    
    // Example placeholder
    const result = { received: data };

    // 4. Standardized Success Response
    return APIResponse.send(HTTP_STATUS.OK).json({
      success: true,
      message: 'Operation completed successfully',
      data: result,
    });

  } catch (error) {
    console.error('[API Error - ${cleanRoutePath}]:', error);
    
    // 5. Standardized Error Response
    return APIResponse.send(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR',
    });
  }
}

/**
 * GET /api/${cleanRoutePath}
 * Description: TODO: Add description
 */
export async function GET(req: NextRequest) {
  try {
    // 1. TODO: Execute Business Logic
    const data = {};

    // 2. Standardized Success Response
    return APIResponse.send(HTTP_STATUS.OK).json({
      success: true,
      message: 'Data fetched successfully',
      data,
    });
  } catch (error) {
    console.error('[API Error - ${cleanRoutePath}]:', error);
    
    // 3. Standardized Error Response
    return APIResponse.send(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR',
    });
  }
}
`;

// Write file
fs.writeFileSync(filePath, routeTemplate, 'utf-8');

console.log(`\n✅ Successfully scaffolded API route!`);
console.log(`📁 File created at: src/app/api/${cleanRoutePath}/route.ts`);
console.log(`\nRemember to:`);
console.log(`1. Move complex business logic to a dedicated service file in src/utils/ or src/lib/services/`);
console.log(`2. Update the Zod schema`);
console.log(`3. Connect to the database using the shared Prisma instances if necessary\n`);
