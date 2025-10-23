const mongoose = require('mongoose');
const User = require('./schemas/users');
const Role = require('./schemas/roles');

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/NNPTUD-S5')
  .then(() => console.log('✅ Kết nối MongoDB thành công'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

async function createUserFixed() {
  try {
    console.log('🔄 Đang xóa user cũ...');
    
    // Xóa user cũ nếu có
    await User.deleteOne({ username: 'user1' });
    console.log('✅ Đã xóa user cũ');
    
    // Tìm role USER
    const role = await Role.findOne({ name: 'USER' });
    if (!role) {
      console.error('❌ Role USER không tồn tại');
      return;
    }
    
    // Tạo user mới (password sẽ được hash tự động bởi middleware)
    const newUser = new User({
      username: 'user1',
      email: 'user1@example.com',
      password: 'User123456', // Password gốc, sẽ được hash tự động
      role: role._id
    });
    
    await newUser.save();
    console.log('✅ Đã tạo user thành công:');
    console.log('   - Username: user1');
    console.log('   - Password: User123456');
    console.log('   - Email: user1@example.com');
    console.log('   - Role: USER');
    
  } catch (error) {
    console.error('❌ Lỗi khi tạo user:', error);
  } finally {
    mongoose.disconnect();
  }
}

createUserFixed();
