import mongoose from 'mongoose';

const userId = new mongoose.Types.ObjectId().toString();
const referenceId = new mongoose.Types.ObjectId().toString();

console.log('User ID:', userId);
console.log('Reference ID:', referenceId);
