import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { mockUsers, mockOrganizations } from '@/lib/passport';
import { corsHeaders } from '@/lib/cors';

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  });
}

async function handler(request: AuthenticatedRequest) {
  try {
    const { userId } = request.user;

    // Find user in database
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404, headers: corsHeaders() }
      );
    }

    // Find organization
    const organization = mockOrganizations.find(org => org.id === user.organizationId);

    // Remove password from response
    const { password: _, ...userProfile } = user;

    return NextResponse.json({
      success: true,
      data: {
        user: userProfile,
        organization: organization || null
      }
    }, { headers: corsHeaders() });

  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export const GET = withAuth(handler);