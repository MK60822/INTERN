const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const seedUsers = async () => {
    try {
        await connectDB();

        // Clear existing users (optional - comment out if you want to keep existing users)
        // await User.deleteMany({});

        // Create Admin
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@school.edu',
            password: 'admin123',
            role: 'admin'
        });

        console.log('✅ Admin created:', admin.email);

        // Create Teachers
        const teachers = await User.insertMany([
            {
                name: 'Dr. John Smith',
                email: 'john.smith@school.edu',
                password: 'teacher123',
                role: 'teacher',
                department: 'Computer Science'
            },
            {
                name: 'Prof. Sarah Johnson',
                email: 'sarah.johnson@school.edu',
                password: 'teacher123',
                role: 'teacher',
                department: 'Mathematics'
            }
        ]);

        console.log(`✅ ${teachers.length} Teachers created`);

        // Create Students
        const students = await User.insertMany([
            {
                name: 'Alice Brown',
                email: 'alice@student.edu',
                password: 'student123',
                role: 'student',
                rollNumber: 'CS2024001'
            },
            {
                name: 'Bob Wilson',
                email: 'bob@student.edu',
                password: 'student123',
                role: 'student',
                rollNumber: 'CS2024002'
            },
            {
                name: 'Charlie Davis',
                email: 'charlie@student.edu',
                password: 'student123',
                role: 'student',
                rollNumber: 'CS2024003'
            },
            {
                name: 'Diana Martinez',
                email: 'diana@student.edu',
                password: 'student123',
                role: 'student',
                rollNumber: 'CS2024004'
            },
            {
                name: 'Ethan Garcia',
                email: 'ethan@student.edu',
                password: 'student123',
                role: 'student',
                rollNumber: 'CS2024005'
            }
        ]);

        console.log(`✅ ${students.length} Students created`);

        console.log('\n🎉 Seed data created successfully!');
        console.log('\n📝 Login Credentials:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('ADMIN:');
        console.log('  Email: admin@school.edu');
        console.log('  Password: admin123');
        console.log('\nTEACHER:');
        console.log('  Email: john.smith@school.edu');
        console.log('  Password: teacher123');
        console.log('\nSTUDENT:');
        console.log('  Email: alice@student.edu');
        console.log('  Password: student123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedUsers();

