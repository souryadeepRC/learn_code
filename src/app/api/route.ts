import { HTTP_STATUS } from '@/constants/api';
import { APIResponse } from '@/utils/api';

export async function GET() {
  return APIResponse.send(HTTP_STATUS.OK).json({
    message: 'Welcome To Learn Code',
  });
}
