import connectDB from './mongodb';
import Admin from '../models/Admin';

export async function seedAdmin() {
  await connectDB();

  // Check if admin already exists
  const existingAdmin = await Admin.findOne({ email: 'kavikarpagam6@gmail.com' });
  if (existingAdmin) {
    console.log('Admin already seeded.');
    return;
  }

  // Create the admin user
  try {
    const admin = new Admin({
      email: 'kavikarpagam6@gmail.com',
      password: 'admin123',
    });
    await admin.save();
    console.log('Admin seeded successfully.');
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
}
