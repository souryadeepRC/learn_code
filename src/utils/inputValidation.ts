import { NextRequest } from 'next/server';
import { HTTP_STATUS } from '../constants/api';

const emojiRegex = /[\p{Extended_Pictographic}\u200d\uFE0F]/u;
const controlCharRegex = /[\u0000-\u001F\u007F]/;
const suspiciousQueryRegex =
  /\b(select|union|drop|delete|insert|update|from|where|script|or\s+1\s*=\s*1)\b/i;

type ParsedJsonBodyResult =
  | { success: true; data: unknown }
  | { success: false; status: number; message: string };

export const containsForbiddenContent = (value: unknown): boolean => {
  if (typeof value === 'string') {
    const trimmedValue = value.trim();

    if (!trimmedValue) return false;

    return (
      emojiRegex.test(trimmedValue) ||
      controlCharRegex.test(trimmedValue) ||
      suspiciousQueryRegex.test(trimmedValue)
    );
  }

  if (Array.isArray(value)) {
    return value.some((item) => containsForbiddenContent(item));
  }

  if (value && typeof value === 'object') {
    return Object.values(value).some((item) => containsForbiddenContent(item));
  }

  return false;
};

export const isSafeText = (value: string): boolean => {
  return !containsForbiddenContent(value);
};

export const validateAuthPayload = (payload: unknown) => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return false;
  }

  return !containsForbiddenContent(payload);
};

export const parseJsonBody = async (
  request: NextRequest,
  maxBytes = 8 * 1024
): Promise<ParsedJsonBodyResult> => {
  const contentType = request.headers.get('content-type')?.toLowerCase() ?? '';

  if (!contentType.includes('application/json')) {
    return {
      success: false,
      status: 415,
      message: 'Content-Type must be application/json',
    };
  }

  const rawBody = await request.text();

  if (rawBody.length === 0) {
    return {
      success: false,
      status: 400,
      message: 'Request body is empty',
    };
  }

  if (rawBody.length > maxBytes) {
    return {
      success: false,
      status: 413,
      message: 'Payload too large',
    };
  }

  try {
    const parsedBody = JSON.parse(rawBody);
    if (!validateAuthPayload(parsedBody)) {
      return {
        success: false,
        status: HTTP_STATUS.BAD_REQUEST,
        message: 'Invalid request payload. Expected a JSON object.',
      };
    }
    return {
      success: true,
      data: parsedBody,
    };
  } catch {
    return {
      success: false,
      status: 400,
      message: 'Invalid JSON payload',
    };
  }
};
