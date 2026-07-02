import { HTTP_STATUS } from '@/constants/api';
import { APIResponse } from '@/utils/api';

export const GET = async () => {
  return APIResponse.send(HTTP_STATUS.OK).json({
    message: 'Welcome To Skill Track AI',
  });
};
