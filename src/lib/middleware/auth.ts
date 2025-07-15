import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '../jwt';
import { JWTPayload } from '@/types/auth';

export interface AuthenticatedRequest extends NextRequest {
  user: JWTPayload;
}

export function withAuth(handler: (request: AuthenticatedRequest) => Promise<Response>) {
  return async (request: NextRequest) => {
    try {
      const authHeader = request.headers.get('authorization');
      const token = extractTokenFromHeader(authHeader);

      if (!token) {
        return NextResponse.json(
          { success: false, message: 'Authentication token required' },
          { status: 401 }
        );
      }

      const payload = verifyToken(token);

      if (!payload) {
        return NextResponse.json(
          { success: false, message: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      // Add user info to request
      const authenticatedRequest = request as AuthenticatedRequest;
      authenticatedRequest.user = payload;

      return handler(authenticatedRequest);
    } catch (error) {
      console.error('Authentication middleware error:', error);
      return NextResponse.json(
        { success: false, message: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
}

export function withOrganizationAccess(
  handler: (request: AuthenticatedRequest) => Promise<Response>
) {
  return withAuth(async (request: AuthenticatedRequest) => {
    const { organizationId } = request.user;
    
    if (!organizationId) {
      return NextResponse.json(
        { success: false, message: 'Organization access required' },
        { status: 403 }
      );
    }

    return handler(request);
  });
}

export function withRole(roles: string[]) {
  return (handler: (request: AuthenticatedRequest) => Promise<Response>) => {
    return withAuth(async (request: AuthenticatedRequest) => {
      const { role } = request.user;
      
      if (!roles.includes(role)) {
        return NextResponse.json(
          { success: false, message: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      return handler(request);
    });
  };
}