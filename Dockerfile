# Sử dụng node image với phiên bản mong muốn
FROM node:16

# Thiết lập thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép file package.json và package-lock.json (nếu có) vào thư mục làm việc
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép các mã nguồn của ứng dụng vào thư mục làm việc trong container
COPY . .

# Mở cổng 3000 (hoặc cổng bạn đã cấu hình trong ứng dụng Express.js)
EXPOSE 4007

# Command để khởi động ứng dụng (sử dụng nodemon để tự động khởi động lại khi có thay đổi)
CMD ["npm", "start"]
