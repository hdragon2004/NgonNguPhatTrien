const mongoose = require('mongoose');
const User = require('./schemas/users');
const Role = require('./schemas/roles');
const bcrypt = require('bcrypt');

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/NNPTUD-S5')
  .then(() => console.log('✅ Kết nối MongoDB thành công'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

async function recreateUser() {
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
    
    // Hash password
    const password = 'User123456';
    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log('🔐 Password gốc:', password);
    console.log('🔐 Password hash:', hashedPassword);
    
    // Test hash
    const testMatch = bcrypt.compareSync(password, hashedPassword);
    console.log('🧪 Test hash:', testMatch ? '✅ OK' : '❌ FAIL');
    
    // Tạo user mới
    const newUser = new User({
      username: 'user1',
      email: 'user1@example.com',
      password: hashedPassword,
      role: role._id
    });
    
    await newUser.save();
    console.log('✅ Đã tạo user mới thành công');
    
    // Test lại
    const savedUser = await User.findOne({ username: 'user1' });
    const finalTest = bcrypt.compareSync(password, savedUser.password);
    console.log('🎯 Final test:', finalTest ? '✅ PASS' : '❌ FAIL');
    
  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    mongoose.disconnect();
  }
}

recreateUser();
