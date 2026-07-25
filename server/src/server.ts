import app from './app';
import { connectDB } from './config/db';
import { Admin } from './models/Admin';
import bcryptjs from 'bcryptjs';

const PORT = process.env.PORT || 5000;

// Seed default administrator if none exist
const seedDefaultAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log('No administrator found. Seeding default admin account...');
      const defaultEmail = 'admin@leaddesk.com';
      const defaultPassword = 'AdminPass123!';
      
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(defaultPassword, salt);
      
      const newAdmin = new Admin({
        email: defaultEmail,
        password: hashedPassword,
      });
      
      await newAdmin.save();
      console.log('--------------------------------------------------');
      console.log('Default Administrator Seeding Successful!');
      console.log(`Email: ${defaultEmail}`);
      console.log(`Password: ${defaultPassword}`);
      console.log('--------------------------------------------------');
    }
  } catch (error) {
    console.error('Error seeding default admin:', error);
  }
};

const startServer = async () => {
  // Connect to Database
  await connectDB();
  
  // Seed Default Admin
  await seedDefaultAdmin();

  // Start Express Server
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer();
