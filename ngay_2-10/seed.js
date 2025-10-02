const mongoose = require('mongoose');
const User = require('./schemas/user');
const Role = require('./schemas/role');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/UserRoleDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

async function seedData() {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Role.deleteMany({});
        console.log('Cleared existing data');

        // Create roles
        const adminRole = new Role({
            name: 'Admin',
            description: 'Quản trị viên hệ thống với quyền truy cập đầy đủ'
        });

        const userRole = new Role({
            name: 'User',
            description: 'Người dùng thông thường với quyền hạn cơ bản'
        });

        const moderatorRole = new Role({
            name: 'Moderator',
            description: 'Người kiểm duyệt với quyền quản lý nội dung'
        });

        await adminRole.save();
        await userRole.save();
        await moderatorRole.save();
        console.log('Created roles');

        // Create users
        const users = [
            {
                username: 'admin',
                password: 'admin123',
                email: 'admin@example.com',
                fullName: 'Quản trị viên',
                status: false,
                role: adminRole._id,
                avatarUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Admin'
            },
            {
                username: 'john_doe',
                password: 'user123',
                email: 'john@example.com',
                fullName: 'John Doe',
                status: false,
                role: userRole._id,
                avatarUrl: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=John'
            },
            {
                username: 'jane_smith',
                password: 'user123',
                email: 'jane@example.com',
                fullName: 'Jane Smith',
                status: false,
                role: moderatorRole._id,
                avatarUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Jane'
            },
            {
                username: 'test_user',
                password: 'test123',
                email: 'test@example.com',
                fullName: 'Test User',
                status: false,
                role: userRole._id,
                loginCount: 0
            }
        ];

        for (const userData of users) {
            const user = new User(userData);
            await user.save();
        }
        console.log('Created users');

        console.log('Seed data created successfully!');
        console.log('\nSample data:');
        console.log('Roles:', await Role.find({}, 'name description'));
        console.log('Users:', await User.find({}, 'username email fullName status').populate('role', 'name'));

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        mongoose.connection.close();
    }
}

seedData();