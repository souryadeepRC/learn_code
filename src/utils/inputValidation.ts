import { HTTP_STATUS } from '@/constants/api';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';
import { APIResponse } from './api';

const emojiRegex = /[\p{Extended_Pictographic}\u200d\uFE0F]/u;
const controlCharRegex = /[\u0000-\u001F\u007F]/;
// Removed generic SQL keywords (insert, update, select, delete) as they block legitimate technical notes 
// and break Quill Delta JSON (which uses {"insert": "text"}). 
const suspiciousQueryRegex = /<(script|iframe|object|embed|applet)/i;

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
    return { isValid: false, reason: 'Expected a JSON object.' };
  }

  if (containsForbiddenContent(payload)) {
    return { isValid: false, reason: 'Payload contains forbidden characters or scripts.' };
  }

  return { isValid: true };
};

export const validateRequestBody = async (
  request: NextRequest,
  maxBytes = 8 * 1024
): Promise<ParsedJsonBodyResult> => {
  const contentLength = request.headers.get('content-length');
  if (contentLength === '0' || !request.body) {
    return {
      success: true,
      data: {},
    };
  }

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
    const validation = validateAuthPayload(parsedBody);
    if (!validation.isValid) {
      return {
        success: false,
        status: HTTP_STATUS.BAD_REQUEST,
        message: `Invalid request payload. ${validation.reason}`,
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
export const getParsedPayload = <T>(
  schema: z.ZodType<T>,
  payload: unknown
): T | NextResponse => {
  const parsedBody = schema.safeParse(payload);

  if (!parsedBody.success) {
    return APIResponse.send(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Invalid payload',
      errors: parsedBody.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }
  return parsedBody.data;
};
