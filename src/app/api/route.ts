import { APIResponse } from '@/utils/api';

export async function GET() {
  return APIResponse.ok({
    message: 'Welcome To Learn Code',
  });
}
