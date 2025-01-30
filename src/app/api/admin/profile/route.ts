import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

// GET admin profile
export async function GET() {
  try {
    // Get admin token from cookies
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token');

    if (!adminToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify admin token
    try {
      await jwtVerify(
        adminToken.value,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectDB();
    const admin = await Admin.findOne().select('-password');

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      email: admin.email,
      profileImage: admin.profileImage || '/placeholder.svg'
    });

  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin profile' },
      { status: 500 }
    );
  }
}

// PUT update admin profile
export async function PUT(request: Request) {
  try {
    // Get admin token from cookies
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token');

    if (!adminToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify admin token
    try {
      await jwtVerify(
        adminToken.value,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
    } catch (error) {
        console.log(error)
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const profileImage = formData.get('profileImage');

    await connectDB();
    const admin = await Admin.findOne();

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    // Update fields if provided
    if (email) admin.email = email;
    if (profileImage) {
      const buffer = Buffer.from(await (profileImage as File).arrayBuffer());
      const base64Image = `data:${(profileImage as File).type};base64,${buffer.toString('base64')}`;
      admin.profileImage = base64Image;
    }

    await admin.save();

    return NextResponse.json({
      email: admin.email,
      profileImage: admin.profileImage
    });

  } catch (error) {
    console.error('Error updating admin profile:', error);
    return NextResponse.json(
      { error: 'Failed to update admin profile' },
      { status: 500 }
    );
  }
}
