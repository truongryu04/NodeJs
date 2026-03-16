# Ecommerce-NodeJS

Ecommerce-NodeJS là hệ thống cho một ứng dụng thương mại điện tử tích hợp quản trị, xác thực người dùng, giỏ hàng, đặt hàng và chat realtime.

## 1) Điểm nổi bật

- Kiến trúc MVC rõ ràng: `controllers`, `models`, `routes`, `middlewares`, `helpers`, `views`.
- Phân tách luồng **Client** và **Admin**:
  - Client: sản phẩm, tìm kiếm, giỏ hàng, checkout, tài khoản người dùng, chat.
  - Admin: dashboard, sản phẩm, danh mục, đơn hàng, vai trò, tài khoản, cài đặt.
- Kết nối MongoDB qua Mongoose.
- Hỗ trợ upload ảnh với Multer + Cloudinary.
- Hỗ trợ gửi email qua Nodemailer.
- Tích hợp Socket.IO cho tính năng chat thời gian thực.
- Render giao diện bằng Pug.

## 2) Công nghệ sử dụng

- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.IO
- Pug
- Multer + Cloudinary
- Nodemailer
- dotenv

## 3) Cấu trúc thư mục

```text
Backend-NodeJS/
├─ config/            # Kết nối DB, cấu hình hệ thống
├─ controllers/       # Xử lý nghiệp vụ (admin/client)
├─ helpers/           # Hàm tiện ích (search, pagination, mail, upload...)
├─ middlewares/       # Middleware cho admin/client
├─ models/            # Mongoose models
├─ public/            # Static assets
├─ routes/            # Định tuyến admin/client
├─ sockets/           # Xử lý realtime (chat)
├─ upload/            # File upload tạm thời
├─ validates/         # Validate request
├─ views/             # Giao diện Pug
├─ index.js           # Entry point
├─ vercel.json        # Cấu hình deploy Vercel
└─ package.json
```

## 4) Điều kiện chạy

- Node.js >= 18
- npm >= 9
- MongoDB instance (local hoặc cloud)

## 5) Cài đặt nhanh

```bash
npm install
```

Tạo file `.env` tại thư mục gốc project và cấu hình theo mẫu bên dưới.

## 6) Biến môi trường

```env
PORT=3000
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>/<database>

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

## 7) Chạy project

### Chế độ phát triển (khuyến nghị)

```bash
npm run start
```

Mặc định server chạy tại:

```text
http://localhost:3000
```

### Scripts hiện có

```json
{
  "start": "nodemon --inspect index.js",
  "dev": "nodemon index.js"
}
```
## 8) Tổng quan route

### Client routes

- `/` - Trang chủ
- `/product` - Danh sách sản phẩm
- `/product/detail/:slugProduct` - Chi tiết sản phẩm
- `/search` - Tìm kiếm
- `/cart` - Giỏ hàng
- `/checkout` - Thanh toán/đặt hàng
- `/user/*` - Đăng ký, đăng nhập, quên mật khẩu, cập nhật thông tin
- `/chat/:roomChatId` - Chat theo phòng (yêu cầu đăng nhập)
- `/users/*` - Danh sách/bạn bè/kết nối người dùng
- `/rooms-chat/*` - Quản lý phòng chat

### Admin routes

Tiền tố admin được cấu hình tại `config/system.js` là `/admin`.

- `/admin/dashboard`
- `/admin/product`
- `/admin/product-category`
- `/admin/order`
- `/admin/role`
- `/admin/account`
- `/admin/auth`
- `/admin/my-account`
- `/admin/settings`

## 9) Triển khai Vercel

Project đã có `vercel.json` để chạy entrypoint `index.js`:

```json
{
  "version": 2,
  "builds": [{ "src": "index.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "index.js" }]
}
```

Deploy nhanh:

```bash
vercel
```

