import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      tls: true,
      family: 4, // Force IPv4 routing to bypass MongoDB Atlas IPv6 TLS issues
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
