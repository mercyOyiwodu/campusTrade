# 🏫 CampusTrade

**CampusTrade** is a smart eCommerce platform built to empower students to buy, sell, and trade goods and services within their campus communities. Developed as a hackathon project, it integrates secure authentication, wallet transactions, ad subscriptions, and delivery coordination — all tailored for student life.

---

## 🚀 Features

### 👩‍💼 Seller & Admin System
- Seller registration with email verification
- Secure JWT login/logout
- Password reset via OTP with HTML email templates
- Seller dashboard showing earnings & stats
- Admin login and seller verification
- Product approval workflow

### 📦 Product & Category Management
- Post products with multiple images (via Cloudinary)
- Product moderation: pending or approved
- Category creation with logo upload
- Paid ad subscriptions for product visibility (Paystack-powered)

### 💳 Transactions
- Make Payment using Paystack
- Webhook listener for real-time payment confirmation
- Track all user transactions
- Referral bonuses and event logging


---

## 🛠 Tech Stack

| Layer      | Tech                                             |
|------------|--------------------------------------------------|
| Backend    | Node.js, Express.js                              |
| Database   | MongoDB + Mongoose (migrated from Sequelize)     |
| Auth       | JWT, OTP (email), Bcrypt                         |
| Payments   | Paystack + webhook integration                   |
| File Upload| Multer + Cloudinary                              |
| Frontend   | [CampusTrade Frontend](https://campus-trade-h7bq.vercel.app/) |
| Docs       | Swagger UI for API documentation                 |

---

## ⚡ Getting Started

### 🔧 Setup (Local Development)

```bash
git clone https://github.com/yourusername/campustrade.git
cd campustrade
npm install
