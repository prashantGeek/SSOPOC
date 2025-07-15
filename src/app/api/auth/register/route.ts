import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';
import { mockUsers, mockOrganizations } from '@/lib/passport';
import { RegisterRequest, AuthResponse, User } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    const { email, password, firstName, lastName, organizationDomain } = body;

    // Validation
    if (!email || !password || !firstName || !lastName || !organizationDomain) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Find organization by domain
    const organization = mockOrganizations.find(org => org.domain === organizationDomain);
    if (!organization) {
      return NextResponse.json(
        { success: false, message: 'Invalid organization domain' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      organizationId: organization.id,
      role: 'user',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to mock database (in real app, save to database)
    mockUsers.push(newUser);

    // Generate JWT token
    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      organizationId: newUser.organizationId,
      role: newUser.role
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    const response: AuthResponse = {
      success: true,
      token,
      user: userWithoutPassword,
      message: 'Registration successful'
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}