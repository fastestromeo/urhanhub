# UrbanHub E-Commerce & Service Booking Platform

UrbanHub is a dual-application web platform consisting of a public storefront and an administrative console. It is built with HTML, CSS, JavaScript, and uses Supabase for the backend.

## 🌐 Live Website Links
- **Storefront**: [https://urhanhub.vercel.app](https://urhanhub.vercel.app)
- **Admin Portal**: [https://urhanhub.vercel.app/admin_portal/login](https://urhanhub.vercel.app/admin_portal/login)

*(Local deployment options are also available below if you wish to run it offline).*

## 🚀 How to Access and Run the System

### Prerequisites
1. Ensure you have **Node.js** and **npm** installed on your computer. You can download them from [nodejs.org](https://nodejs.org/).
2. Clone or extract this repository to your local machine.

### Installation & Setup
1. Open your terminal or command prompt.
2. Navigate to the root directory of the project:
   ```bash
   cd path/to/zillow
   ```
3. Install the necessary dependencies (this will install the required local servers):
   ```bash
   npm install
   ```

### Running the Application

You can run both the Storefront and the Admin portal simultaneously, or individually.

**Option 1: Run Both Apps Concurrently (Recommended)**
```bash
npm run start
```
- Storefront will be available at: `http://localhost:3000`
- Admin Portal will be available at: `http://localhost:3001`

**Option 2: Run Storefront Only**
```bash
npm run storefront
```

**Option 3: Run Admin Portal Only**
```bash
npm run admin
```

### Authentication Details
The platform uses Supabase for authentication.
- **Customers**: Can create a new account from the Storefront by clicking on the **Login** link in the navigation bar and selecting the Sign Up option.
- **Checkout & Services**: You must be logged in to access the checkout and service booking confirmation screens.

**Admin Portal Access (Demo Mode)**: 
To access the Admin Console, use the following demo credentials at the [Admin Login Page](https://urhanhub.vercel.app/admin_portal/login):
- **Email**: `admin@urbanhub.com`
- **Password**: `admin123`
*(Note: Because this is a demonstration build, the admin portal login bypasses strict verification to allow easy evaluation of the dashboard UI).*

## 📁 Repository Structure
- `/admin_portal` - The admin dashboard application.
- `/supabase` - Contains the database schema (`schema.sql`).
- `/*.html & /*.js` - The main storefront application files.
