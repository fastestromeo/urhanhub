---
marp: true
theme: default
class: lead
---

# UrbanHub
**E-Commerce Storefront and Service Booking Platform**

**Ghana Institute of Management and Public Administration (GIMPA)**
Presented By: Daniel Owusu-Manu (220013004)

---

## 📌 Problem Statement

- Managing product sales and service appointments across multiple disconnected tools leads to data fragmentation.
- Operators lack a unified dashboard to monitor purchases, bookings, and customer activity simultaneously.
- Customers face friction when switching between different platforms to shop for items and book professional services.

---

## 🎯 Project Objectives

- **Unified Platform**: Develop a single web system handling both e-commerce product sales and service appointment bookings.
- **Storefront Integration**: Build a dynamic product catalog, individual product pages, and a checkout flow.
- **Secure Authentication**: Implement robust email/password authentication to gate checkouts and bookings.
- **Admin Visibility**: Provide a dedicated Admin Console for operational monitoring of orders, product inventory, and customer activities.

---

## 🏗️ System Architecture & Tech Stack

**Frontend Layer**
- Vanilla HTML5, CSS3, and JavaScript ES Modules
- Responsive grid and flexbox designs for seamless cross-device usage

**Backend Layer (Supabase)**
- **Authentication**: Supabase Auth (Email & Password)
- **Database**: PostgreSQL (Tables: `products`, `orders`, `activity`, `users`, `settings`)
- **API**: Supabase JavaScript Client for secure client-to-database communication

---

## 🔑 Key Features

1. **Product Browsing & Purchasing**: Users can view the catalog, inspect product details, and proceed to checkout.
2. **Service Booking**: Integrated widget allowing customers to schedule service appointments and specify appointment times.
3. **Authentication Guard**: Protected checkout and booking processes ensure only authenticated users can place orders, utilizing a redirect-back mechanism.
4. **Admin Dashboard**: Real-time monitoring of operations, order status updates, inventory management, and platform configuration.

---

## 🚀 System Demonstration

- **Storefront Navigation**: Catalog → Product Details → Checkout
- **Authentication Flow**: Sign-up / Login → Redirects upon successful authentication
- **Service Booking**: Appointment Selection → Confirmation & Database Logging
- **Admin Console**: Order Management (Approval/Rejection) → Product Updates → Activity Logs Review

---

## 🏁 Conclusion & Future Work

**Conclusion**
UrbanHub successfully demonstrates the viability of a unified architecture for mixed retail and service businesses, significantly lowering operational overhead and improving the customer experience.

**Future Recommendations**
- Enforce strict Row Level Security (RLS) policies in PostgreSQL for production deployment.
- Implement advanced Role-Based Access Control (RBAC) to differentiate Staff versus Admin roles.
- Integrate a real payment gateway (e.g., Paystack or Stripe) for automated transaction processing.

---

# Thank You!
**Questions & Answers**
