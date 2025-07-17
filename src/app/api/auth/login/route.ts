import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';
import { mockUsers, mockOrganizations } from '@/lib/passport';
import { LoginRequest, AuthResponse } from '@/types/auth';
import { handleCors, corsHeaders } from '@/lib/cors';

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password, organizationDomain } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Find user by email
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401, headers: corsHeaders() }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401, headers: corsHeaders() }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Account is inactive' },
        { status: 401, headers: corsHeaders() }
      );
    }

    // Verify organization domain if provided
    if (organizationDomain) {
      const organization = mockOrganizations.find(org => org.id === user.organizationId);
      if (!organization || organization.domain !== organizationDomain) {
        return NextResponse.json(
          { success: false, message: 'Invalid organization domain' },
          { status: 401, headers: corsHeaders() }
        );
      }
    }

    // Generate JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      organizationId: user.organizationId,
      role: user.role
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    const response: AuthResponse = {
      success: true,
      token,
      user: userWithoutPassword,
      message: 'Login successful'
    };

    return NextResponse.json(response, { 
      status: 200, 
      headers: corsHeaders() 
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500, headers: corsHeaders() }
    );
  }
}