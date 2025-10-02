# User & Role Management System

Hệ thống quản lý người dùng và vai trò với đầy đủ chức năng CRUD và giao diện web.

## 🚀 Tính năng

### User Management
- **GET all users** với tìm kiếm theo username, fullname (check chứa)
- **GET user by ID** - Lấy thông tin user theo ID
- **GET user by username** - Lấy thông tin user theo username
- **CREATE user** - Tạo user mới
- **UPDATE user** - Cập nhật thông tin user
- **SOFT DELETE user** - Xóa mềm user (set isDelete = true)

### Role Management
- **GET all roles** - Lấy tất cả roles
- **GET role by ID** - Lấy thông tin role theo ID
- **CREATE role** - Tạo role mới
- **UPDATE role** - Cập nhật thông tin role
- **SOFT DELETE role** - Xóa mềm role

### User Verification
- **POST verify** - Truyền lên email và username, nếu thông tin đúng thì chuyển status về true

## 📋 Yêu cầu hệ thống

- Node.js (v14 trở lên)
- MongoDB
- npm hoặc yarn

## 🛠️ Cài đặt

1. **Clone project và cài đặt dependencies:**
```bash
npm install
```

2. **Khởi động MongoDB:**
Đảm bảo MongoDB đang chạy trên `mongodb://localhost:27017`

3. **Tạo dữ liệu mẫu (tùy chọn):**
```bash
node seed.js
```

4. **Khởi động server:**
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## 🌐 API Endpoints

### Users
- `GET /users` - Lấy tất cả users (có thể tìm kiếm với query `?search=keyword`)
- `GET /users/:id` - Lấy user theo ID
- `GET /users/username/:username` - Lấy user theo username
- `POST /users` - Tạo user mới
- `PUT /users/:id` - Cập nhật user
- `DELETE /users/:id` - Xóa mềm user
- `POST /users/verify` - Xác thực user (email + username)

### Roles
- `GET /roles` - Lấy tất cả roles
- `GET /roles/:id` - Lấy role theo ID
- `POST /roles` - Tạo role mới
- `PUT /roles/:id` - Cập nhật role
- `DELETE /roles/:id` - Xóa mềm role

## 🖥️ Giao diện Web

Truy cập `http://localhost:3000` để sử dụng giao diện web với các tab:

1. **👥 Users** - Quản lý users
2. **🎭 Roles** - Quản lý roles  
3. **✅ Verify User** - Xác thực user

## 📊 Cấu trúc Database

### User Schema
```javascript
{
  username: String (required, unique),
  password: String (required),
  email: String (required, unique),
  fullName: String,
  avatarUrl: String,
  status: Boolean (default: false),
  role: ObjectId (ref: 'role', required),
  loginCount: Number (default: 0),
  isDelete: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Role Schema
```javascript
{
  name: String (required, unique),
  description: String,
  isDelete: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Test với dữ liệu mẫu

Sau khi chạy `node seed.js`, bạn sẽ có:

### Roles:
- **Admin** - Quản trị viên hệ thống
- **User** - Người dùng thông thường
- **Moderator** - Người kiểm duyệt

### Users:
- **admin** (admin@example.com) - Status: true, Role: Admin
- **john_doe** (john@example.com) - Status: false, Role: User
- **jane_smith** (jane@example.com) - Status: true, Role: Moderator
- **test_user** (test@example.com) - Status: false, Role: User

## 🔍 Ví dụ sử dụng API

### Tìm kiếm users:
```bash
GET /users?search=john
GET /users?search=admin
```

### Tạo user mới:
```bash
POST /users
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123",
  "email": "newuser@example.com",
  "fullName": "New User",
  "role": "ROLE_ID_HERE"
}
```

### Xác thực user:
```bash
POST /users/verify
Content-Type: application/json

{
  "email": "john@example.com",
  "username": "john_doe"
}
```

## 🛡️ Tính năng bảo mật

- Soft delete: Dữ liệu không bị xóa vĩnh viễn
- Validation: Kiểm tra dữ liệu đầu vào
- Unique constraints: Username và email không trùng lặp
- Error handling: Xử lý lỗi toàn diện

## 📝 Ghi chú

- Tất cả các API đều trả về JSON với format: `{ success: boolean, data?: any, message?: string }`
- Soft delete: Các bản ghi bị xóa sẽ có `isDelete: true` và không hiển thị trong kết quả
- Tìm kiếm không phân biệt hoa thường (case-insensitive)
- User verification sẽ set `status: true` nếu email và username khớp