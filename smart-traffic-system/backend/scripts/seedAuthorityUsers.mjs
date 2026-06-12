import mongoose from 'mongoose';
import User from '../models/User.js';
import { env } from '../config/env.js';

async function seedAuthorityUsers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if authority users already exist
    const roadAuthority = await User.findOne({ email: 'road@solapur.gov' });
    const municipalCorp = await User.findOne({ email: 'municipal@solapur.gov' });
    const trafficPolice = await User.findOne({ email: 'police@solapur.gov' });

    if (!roadAuthority) {
      const user1 = new User({
        name: 'Rajesh Sharma',
        email: 'road@solapur.gov',
        password: 'password123',
        role: 'road_authority',
        authority: 'road_authority',
        department: 'Public Works Department',
        badgeNumber: 'RA-001',
        jurisdictionArea: 'Central Solapur',
        phone: '7888123456',
        metadata: {
          assignedZones: ['zone-1', 'zone-2', 'zone-3'],
          trafficAuthority: 'Solapur Municipal Corporation'
        }
      });
      await user1.save();
      console.log('✅ Road Authority user created: road@solapur.gov');
    }

    if (!municipalCorp) {
      const user2 = new User({
        name: 'Priya Deshmukh',
        email: 'municipal@solapur.gov',
        password: 'password123',
        role: 'municipal_corp',
        authority: 'municipal_corp',
        department: 'Traffic & Transportation',
        badgeNumber: 'MC-001',
        jurisdictionArea: 'Greater Solapur',
        phone: '7888234567',
        metadata: {
          assignedZones: ['zone-1', 'zone-2', 'zone-3', 'zone-4', 'zone-5'],
          trafficAuthority: 'Solapur Municipal Corporation',
          reportingTo: 'Municipal Commissioner'
        }
      });
      await user2.save();
      console.log('✅ Municipal Corporation user created: municipal@solapur.gov');
    }

    if (!trafficPolice) {
      const user3 = new User({
        name: 'Inspector Vijay Patel',
        email: 'police@solapur.gov',
        password: 'password123',
        role: 'traffic_police',
        authority: 'traffic_police',
        department: 'Traffic Police Division',
        badgeNumber: 'TP-001',
        jurisdictionArea: 'Solapur City',
        phone: '7888345678',
        metadata: {
          assignedZones: ['zone-1', 'zone-2', 'zone-3', 'zone-4', 'zone-5'],
          trafficAuthority: 'Solapur Police Commissioner'
        }
      });
      await user3.save();
      console.log('✅ Traffic Police user created: police@solapur.gov');
    }

    console.log('\n📋 Authority Users Summary:');
    console.log('============================');
    console.log('🛣️  Road Authority: road@solapur.gov / password123');
    console.log('🏢 Municipal Corp: municipal@solapur.gov / password123');
    console.log('👮 Traffic Police: police@solapur.gov / password123');
    console.log('============================\n');

    await mongoose.connection.close();
    console.log('✅ Seeding completed successfully');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedAuthorityUsers();
