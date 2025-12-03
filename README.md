# MERN-Ecommerce
Website thương mại điện tử có đầy đủ các thao tác CRUD cho sản phẩm, danh mục, đơn hàng, người dùng ...v.v, xác thực & phân quyền, tải ảnh lên, thanh toán bằng Stripe hoặc tiền mặt và nhiều tính năng khác.

## Công nghệ sử dụng
- React 
- ReduxToolkit
- Reactstrap, Styled Components
- Formik, Yup
- Node, Express
- MongoDB
- Mongoose
- JsonWebToken
- Express Validator
và còn nữa ...

## Tính năng
- Cấu trúc thư mục hợp lý
- Các component có thể tái sử dụng
- Quản lý trạng thái bằng ReduxToolkit
- Xác thực form bằng Formik, Yup
- Bảng điều khiển quản trị để quản lý tất cả tài nguyên: sản phẩm, đơn hàng, người dùng ...v.v
- Xác thực phía server bằng express-validator
- Tải ảnh lên bằng Multer, Sharp
- Thanh toán bằng Stripe hoặc tiền mặt khi nhận hàng
- Xác thực và phân quyền bằng JWT

## ENV
Để chạy dự án này, bạn cần thêm các biến môi trường sau vào file .env của mình

`PORT`
`NODE_ENV`
`BASE_URL`
`API_URL`
`FILES_UPLOADS_PATH`
`CLIENT_URL`
`MONGO_URI`
`DB_NAME`
`JWT_SECRET`
`JWT_EXPIRE_IN`
`JWT_COOKIE_EXPIRE_IN`
`STRIPE_SECRET_KEY`
`STRIPE_WEBHOOK_SECRET`
