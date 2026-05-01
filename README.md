# UrbanHub E-Commerce & Service Booking Platform

UrbanHub is a dual-application web platform consisting of a public storefront and an administrative console. It is built with HTML, CSS, JavaScript, and uses Supabase for the backend.

## 🌐 Website Link
- **Storefront (Local)**: [http://localhost:3000](http://localhost:3000)
- **Admin Portal (Local)**: [http://localhost:3001](http://localhost:3001)

*(Note: Replace the localhost URLs with your live domain names if you have deployed the application to a provider like Vercel, Netlify, or Render.)*

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

## 📁 Repository Structure
- `/admin_portal` - The admin dashboard application.
- `/supabase` - Contains the database schema (`schema.sql`).
- `/*.html & /*.js` - The main storefront application files.
