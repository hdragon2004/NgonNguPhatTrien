const mongoose = require('mongoose');
const Role = require('./schemas/roles');

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/NNPTUD-S5')
  .then(() => console.log('✅ Kết nối MongoDB thành công'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

async function initRoles() {
  try {
    console.log('🔄 Đang khởi tạo roles...');
    
    const rolesToCreate = [
      { name: 'USER', description: 'Standard user role' },
      { name: 'ADMIN', description: 'Administrator role with full access' },
      { name: 'MOD', description: 'Moderator role with elevated privileges' }
    ];

    for (const roleData of rolesToCreate) {
      const existingRole = await Role.findOne({ name: roleData.name });
      if (existingRole) {
        console.log(`✅ Role ${roleData.name} đã tồn tại`);
      } else {
        await Role.create(roleData);
        console.log(`✅ Đã tạo role ${roleData.name}`);
      }
    }
    
    console.log('🎉 Khởi tạo roles hoàn tất!');
  } catch (error) {
    console.error('❌ Lỗi khi khởi tạo roles:', error);
  } finally {
    mongoose.disconnect();
  }
}

initRoles();
