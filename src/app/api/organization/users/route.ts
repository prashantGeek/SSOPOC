import { NextResponse } from 'next/server';
import { withOrganizationAccess, AuthenticatedRequest } from '@/lib/middleware/auth';
import { mockUsers } from '@/lib/passport';

async function handler(request: AuthenticatedRequest) {
  try {
    const { organizationId } = request.user;
    
    // Filter users by organization
    const organizationUsers = mockUsers
      .filter(u => u.organizationId === organizationId)
      .map(({ password, ...user }) => user); // Remove passwords

    return NextResponse.json({
      success: true,
      data: {
        users: organizationUsers,
        total: organizationUsers.length
      }
    });

  } catch (error) {
    console.error('Organization users error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withOrganizationAccess(handler);