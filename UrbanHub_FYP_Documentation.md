# GHANA INSTITUTE OF MANAGEMENT AND PUBLIC ADMINISTRATION (GIMPA)

## URBANHUB

**(AN E-COMMERCE STOREFRONT AND SERVICE BOOKING PLATFORM)**

**Student Name:** Daniel Owusu-Manu  
**Student ID:** 220013004

> Notes on accuracy (no hallucinations):
>
> - Everything described under the “System” sections is taken from the current repository files in `zillow/`.
> - Any academic content that is not present in the repository (e.g., literature review citations, methodology narrative, dedication/acknowledgement) is marked **TBD**.

---

# DEDICATION

TBD (Write a brief dedication in your own words.)

# ACKNOWLEDGEMENT

TBD (Acknowledge individuals/institutions that supported the project.)

# ABSTRACT

UrbanHub is a dual-application web platform consisting of a public storefront and a separate admin console, implemented with HTML/CSS/JavaScript and backed by Supabase for authentication and database persistence. On the storefront, users can browse a catalogue of products loaded from a Supabase `products` table (including product name, category, price, image URL, and description). Users can open a product details page via a query parameter (e.g., `product?id=...`) and proceed to a checkout page. User authentication is implemented using Supabase Auth with email/password sign-up and sign-in. Pages that require an authenticated user (checkout and service appointment confirmation) use a shared authentication guard that checks for an active Supabase session and redirects unauthenticated users to the login page with a redirect-back URL. During checkout, the system persists an order record to an `orders` table and logs a related entry in an `activity` table. The services page implements a similar flow: selecting a service and confirming an appointment creates an order (`type=service`) and adds an activity log entry for administrative visibility. The admin console reads from the same Supabase backend and supports viewing orders/products/activity/users (if present) and updating platform settings. The relational schema for products, orders, activity, users, and settings is defined in `supabase/schema.sql`.

# DECLARATION

TBD (Fill in supervisor name and date.)

---

# LIST OF TABLES

TBD

# LIST OF FIGURES

TBD

---

# CHAPTER 1: INTRODUCTION

## 1.1 Research Background

UrbanHub is implemented as a hybrid platform that combines an online product storefront with professional service appointment booking. The repository contains two related web applications: (1) a customer-facing storefront and (2) an administrative console for operational monitoring and basic management. From the storefront, users can browse products, view a product details page, authenticate using email/password, and complete a checkout flow. For services, users can select a service type and confirm an appointment; the booking is stored as an order record. From the admin console, an administrator can view orders and activity logs produced by customer actions and can perform management operations such as approving orders and managing product inventory.

## 1.2 Research Problem

In the context of the UrbanHub concept, the problem addressed is the fragmentation that can occur when product discovery, service scheduling, and administrative oversight are handled in disconnected tools. Without an integrated approach, an operator may lack a consistent record of purchases, appointments, and key events, and customers may have to switch between different platforms for browsing, booking, and confirmation. This project implements an integrated workflow where purchases and bookings are stored as structured rows in an `orders` table and important events are recorded in an `activity` table so that the admin console can present recent actions and operational status.

## 1.3 Research Methods

TBD (Describe your academic methods.)

Implementation evidence from the repository shows a prototype built as static web pages (HTML/CSS/JavaScript ES modules) that interact with Supabase services. Both the storefront and admin console use the Supabase JavaScript client to perform database operations (select/insert/update/delete) against the tables defined in `supabase/schema.sql`, and the storefront uses Supabase Auth for email/password authentication.

## 1.4 Research Purpose

The purpose of this project is to design and implement a working prototype of an e-commerce storefront and service booking system (UrbanHub) with a supporting admin console and a persistent backend schema.

## 1.5 Research Objectives

The objectives implemented in this repository include:

- Build a storefront product grid sourced from a Supabase `products` table.
- Provide a product details page that resolves products by query parameter and renders related items.
- Implement email/password authentication (sign up and sign in) using Supabase Auth.
- Gate checkout and service booking behind authentication, with redirect-back support.
- Persist purchases and bookings into an `orders` table and log actions into an `activity` table.
- Build an admin console to view and manage orders, products, activity, and platform settings.
- Provide scripts to serve the storefront and admin console as separate local servers.

## 1.6 Research Significance

The project demonstrates how a single lightweight web codebase can deliver both a customer-facing experience and an operational dashboard backed by the same database schema. It shows end-to-end flows (catalogue → authentication → checkout/booking → admin visibility) and provides a foundation that can be hardened for production (e.g., enabling RLS policies and restricting anonymous privileges).

## 1.7 Research Limitations

This repository represents a demo/prototype environment.

- The included SQL schema grants broad privileges to anon/authenticated roles and explicitly disables row level security for immediate functionality.
- In the admin portal, the login page performs a client-side redirect without credential verification (the login flow is not connected to Supabase Auth in this repository).
- Some admin profile/password actions are explicitly disabled and show messages indicating authentication was removed from those specific features.

## 1.8 Chapter Outline

- Chapter 1 introduces the project context, problem statement, objectives, significance, and limitations.
- Chapter 2 covers background and related concepts (to be supported with citations).
- Chapter 3 describes the chosen methodology.
- Chapter 4 presents analysis and design (requirements, database, and architecture).
- Chapter 5 documents implementation details.
- Chapter 6 concludes the work and provides recommendations.

---

# CHAPTER 2: LITERATURE REVIEW

## 2.1 Introduction

TBD (Add academic and industry sources and cite them appropriately.)

## 2.2 Section Two

TBD (Suggested scope: e-commerce storefront patterns, product catalogue presentation, and checkout flow design—supported by citations.)

## 2.3 Section Three

TBD (Suggested scope: authentication and access control for web applications, including redirect-back login flows.)

## 2.3.1 Sub-Section

TBD

## 2.3.2 Sub-Section Two

TBD

## 2.4 Section Four

TBD (Suggested scope: backend-as-a-service usage for rapid prototyping, and database schema considerations.)

---

# CHAPTER 3: METHODOLOGY

## 3.1 Introduction

This chapter describes the methodology used to design and build UrbanHub. Where academic methods are required (e.g., SDLC model selection), the details should be completed by the student to match the project’s actual process.

## 3.2 Section

TBD (Describe chosen SDLC / development approach and how requirements were gathered.)

## 3.2.1 Sub-Sections (Tools/Stack)

Tools/stack used in the repository (implementation evidence):

- Front-end: HTML, CSS, and JavaScript ES modules.
- Backend services: Supabase Auth (email/password) and Supabase Postgres tables accessed via the Supabase JavaScript client.
- Local serving: `package.json` provides scripts to serve the storefront on port 3000 and the admin portal on port 3001 using `serve`, and a combined start script using `concurrently`.

## 3.2.2 Objectives of Solution

The implemented solution provides a storefront (catalogue + product detail + checkout), an authentication workflow, a service booking flow, and an admin console to monitor and manage orders, products, activity, and platform settings, all backed by a shared Supabase database schema.

## 3.3 Sections

TBD (Suggested scope: testing/validation approach used for the prototype.)

---

# CHAPTER 4: SYSTEMS ANALYSIS AND DESIGN

## 4.1 Introduction

This chapter analyses UrbanHub’s requirements and presents the design of the system components (storefront, admin console, and Supabase database).

## 4.2 Sections

### System overview (as implemented in the repository)

**Storefront pages**

- `index.html`: loads products from Supabase and renders product cards linking to `product?id=...`.
- `product.html`: fetches a single product and shows related products; builds a checkout link containing product id + quantity.
- `services.html`: displays selectable services and provides an appointment confirmation action (handled in `script.js`).
- `auth.html` + `auth.js`: supports login and sign-up with Supabase Auth and a redirect-back mechanism.
- `checkout.html`: requires authentication; persists a new order row and an activity log entry.

**Shared auth utilities**

- `auth-guard.js`: provides `getSession`, `requireAuth` (redirects to `auth?redirect=...`), `signOut`, and navbar profile state via `initNavAuth`.

**Admin console**

- `admin_portal/index.html` + `admin_portal/admin.js`: loads orders, products, users (if present), activity, and settings; provides approve/delete/add/export/save-settings actions.

**Backend**

- `supabase-config.js`: Supabase project client configuration.
- `supabase/schema.sql`: database schema and permissions.

### Database tables (from supabase/schema.sql)

- `products(id, name, category, price, img, desc, created_at)`
- `orders(id, userId, customer, product, amount, status, type, productId, bookingDate, bookingTime, created_at)`
- `activity(id, title, desc, time, color, created_at)`
- `users(id, uid, name, email, role, created_at)`
- `settings(id, supportEmail, phone, address, maintenanceMode, updatedAt)`

### Core data flow (implemented)

- Catalogue read: storefront queries `products` and renders them as cards.
- Authentication: user signs up or signs in; session is checked via `supabase.auth.getSession()`.
- Checkout/booking: a logged-in user creates an `orders` row; a corresponding `activity` row is inserted for admin visibility.
- Admin visibility: admin console reads `orders`/`activity` and performs updates (e.g., approve order).

---

# CHAPTER 5: IMPLEMENTATION

## 5.1 Introduction

This chapter documents how the UrbanHub prototype is implemented in the repository, including key modules, database operations, and admin workflows.

## 5.2 Sections

(Template note: In the provided DOCX template, the detailed placeholder is under 5.2.1.)

## 5.2.1 Sub-Sections

Key implementation points (verifiable from source):

- Supabase client: `supabase-config.js` creates a client via the Supabase JS CDN and is imported across pages.
- Authentication: `auth.js` uses `supabase.auth.signUp` and `supabase.auth.signInWithPassword`; `auth-guard.js` provides `requireAuth`, `getSession`, and `initNavAuth`.
- Product catalogue: `script.js` queries products (`select * from products`, ordered by `created_at`) and renders cards linking to `product?id=...`.
- Product details: `product.html` resolves product IDs using multiple candidate fields (`id`, `product_id`, `productid`) and renders a related-products section.
- Checkout (product purchase): `checkout.html` requires authentication; it reads product info, calculates subtotal/tax/total, inserts a row into `orders` (`type=product`), and inserts a row into `activity` (title: **New Purchase**).
- Service booking: `services.html` uses the booking widget UI and, on confirmation, inserts a row into `orders` (`type=service`) and inserts a row into `activity` (title: **Service Booked**).
- Admin operations: `admin_portal/admin.js` loads `orders`/`users`/`products`/`activity`/`settings`; supports approve (`orders.status → completed` + activity log), delete product (`products.delete`), add product (`products.insert`), export orders to CSV, and save platform settings (`settings.upsert` + activity log).

Additional note:

- `cart-manager.js` implements a localStorage cart (key: `urbanhub_cart`) with helper functions (add/update/remove/totals). In the current codebase it is not imported by other modules.

---

# CHAPTER 6: CONCLUSION

## 6.1 Introduction

This chapter summarizes what was built and discusses future improvements for a production-ready release.

## 6.2 Conclusions

UrbanHub demonstrates a working prototype that combines product commerce and service appointment booking in a single web experience, supported by an admin console and a shared Supabase database schema. The implemented flows include: catalogue rendering from a database table, email/password authentication with redirect-back behavior, gated checkout and booking actions, persistence of orders and activity logs, and administrative monitoring and basic management actions in a separate console.

## 6.3 Recommendations

For production hardening:

- Enable row level security (RLS) and add appropriate policies for each table.
- Remove broad anon privileges and restrict access appropriately.
- Implement real admin authentication/authorization.
- Avoid embedding keys in contexts where elevated permissions are granted.

---

# REFERENCES

TBD (Add your citations here in the required referencing style.)

---

# APPENDIX (Optional)

## How to run (from package.json)

From the `zillow/` folder:

- Start both storefront + admin portal:
  - `npm run start`
- Storefront only:
  - `npm run storefront`
- Admin portal only:
  - `npm run admin`
