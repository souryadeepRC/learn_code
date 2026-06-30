// import { verifyAccessToken } from '@/lib/auth/jwt';
// import { NextRequest, NextResponse } from 'next/server';

// export function withAuth(handler: Function) {
//   return async (req: NextRequest) => {
//     const authHeader = req.headers.get('authorization');

//     if (!authHeader?.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const token = authHeader.slice(7);
//     const payload = verifyAccessToken(token);

//     if (!payload) {
//       return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
//     }

//     return handler(req, { userId: payload.userId, email: payload.email });
//   };
// }
