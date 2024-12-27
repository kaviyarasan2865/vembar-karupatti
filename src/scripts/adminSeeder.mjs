import connectDB  from '@/lib/mongodb';
import Admin from '../models/Admin';

async function seedAdmin() {
  await connectDB();

  const adminEmail = 'kavikarpagam6@gmail.com';
  const adminPassword = 'password123';

  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const newAdmin = new Admin({ email: adminEmail, password: adminPassword });
    await newAdmin.save();
    console.log('Admin seeded:', adminEmail);
  } else {
    console.log('Admin already exists.');
  }

  process.exit();
}

seedAdmin();
