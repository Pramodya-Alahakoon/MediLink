import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

console.log('Environment Variables Check:');
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 25) + '...' : 'NOT FOUND');
console.log('STRIPE_PUBLISHABLE_KEY:', process.env.STRIPE_PUBLISHABLE_KEY ? 'SET' : 'NOT FOUND');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'SET' : 'NOT FOUND');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT FOUND');
console.log('Node ENV:', process.env.NODE_ENV);
console.log('Current directory:', process.cwd());
