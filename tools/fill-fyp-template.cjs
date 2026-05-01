/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");
const JSZip = require("jszip");
const { DOMParser, XMLSerializer } = require("@xmldom/xmldom");

const TEMPLATE_PATH = "c:/Users/Danom/Downloads/BSc Comp Science_IT Template v2 (2)(1).docx";
const OUTPUT_PATH = "c:/Users/Danom/Desktop/zillow/UrbanHub_FYP_Documentation.docx";

const PROJECT_TITLE = "URBANHUB";
const PROJECT_SUBTITLE = "(AN E-COMMERCE STOREFRONT AND SERVICE BOOKING PLATFORM)";

const STUDENT_NAME = "Daniel Owusu-Manu";
const STUDENT_ID = "220013004";

function normalizeText(text) {
  return String(text || "")
    // Normalize whitespace first
    .replace(/[\t\n\r]+/g, " ")
    .replace(/\s+/g, " ")
    // Word sometimes merges headings like "1.1Research" or "CHAPTER 1:INTRODUCTION"
    .replace(/(\d+(?:\.\d+)+)([A-Za-z])/g, "$1 $2")
    .replace(/(:)([A-Za-z])/g, "$1 $2")
    .trim();
}

function paragraphText(paragraphNode) {
  const textNodes = paragraphNode.getElementsByTagName("w:t");
  let out = "";
  for (let i = 0; i < textNodes.length; i++) out += textNodes[i].textContent || "";
  return out;
}

function replaceInParagraph(paragraphNode, searchValue, replaceValue) {
  const textNodes = paragraphNode.getElementsByTagName("w:t");
  let changed = false;
  for (let i = 0; i < textNodes.length; i++) {
    const current = textNodes[i].textContent || "";
    if (!current.includes(searchValue)) continue;
    textNodes[i].textContent = current.split(searchValue).join(replaceValue);
    changed = true;
  }
  return changed;
}

function isPlaceholderParagraph(text) {
  const t = normalizeText(text);
  if (!t) return true;
  // Dots/ellipses placeholders (template uses both . and …)
  return /^[.·…\-\s]+$/.test(t) && t.length >= 3;
}

function setParagraphText(paragraphNode, newText) {
  const textNodes = paragraphNode.getElementsByTagName("w:t");

  // If the paragraph has no text nodes, create a minimal run.
  if (textNodes.length === 0) {
    const doc = paragraphNode.ownerDocument;
    if (!doc) return false;
    const run = doc.createElement("w:r");
    const t = doc.createElement("w:t");
    t.appendChild(doc.createTextNode(newText));
    run.appendChild(t);
    paragraphNode.appendChild(run);
    return true;
  }

  textNodes[0].textContent = newText;
  for (let i = textNodes.length - 1; i >= 1; i--) {
    const n = textNodes[i];
    n.parentNode.removeChild(n);
  }
  return true;
}

function findParagraphIndex(paragraphs, predicate) {
  for (let i = 0; i < paragraphs.length; i++) {
    if (predicate(paragraphs[i], i)) return i;
  }
  return -1;
}

function findParagraphIndexFromEnd(paragraphs, predicate) {
  for (let i = paragraphs.length - 1; i >= 0; i--) {
    if (predicate(paragraphs[i], i)) return i;
  }
  return -1;
}

function fillAfterHeading(paragraphs, headingText, contentText) {
  const normalizedHeading = normalizeText(headingText);
  // There can be multiple occurrences (e.g., in the Table of Contents and in the body).
  // Choose the occurrence that actually has a writable placeholder after it.
  const candidateIdxs = [];
  for (let i = 0; i < paragraphs.length; i++) {
    const t = normalizeText(paragraphText(paragraphs[i]));
    if (t === normalizedHeading || t.startsWith(normalizedHeading)) candidateIdxs.push(i);
  }

  if (candidateIdxs.length === 0) {
    console.warn(`Heading not found: ${headingText}`);
    return false;
  }

  for (const headingIdx of candidateIdxs) {
    for (let i = headingIdx + 1; i < paragraphs.length; i++) {
      const t = paragraphText(paragraphs[i]);
      if (normalizeText(t) === normalizedHeading) continue;
      if (isPlaceholderParagraph(t)) {
        const ok = setParagraphText(paragraphs[i], contentText);
        if (ok) return true;
      }
      // If we hit another heading before a placeholder, stop searching this candidate.
      const maybeHeading = normalizeText(t);
      if (/^(CHAPTER\s+\d+|\d+\.\d+)/i.test(maybeHeading)) break;
    }
  }

  console.warn(`No placeholder found after heading: ${headingText}`);
  return false;
}

async function main() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    throw new Error(`Template not found at ${TEMPLATE_PATH}`);
  }

  const buf = fs.readFileSync(TEMPLATE_PATH);
  const zip = await JSZip.loadAsync(buf);

  const docXmlPath = "word/document.xml";
  const docXml = await zip.file(docXmlPath).async("string");
  const dom = new DOMParser().parseFromString(docXml, "text/xml");

  const paragraphs = Array.from(dom.getElementsByTagName("w:p"));

  // 1) Global title replacements (keep template formatting, only change text)
  for (const p of paragraphs) {
    // Token replacements that must preserve surrounding text (e.g., signature lines).
    replaceInParagraph(p, "Student Name", STUDENT_NAME);
    replaceInParagraph(p, "Student ID", STUDENT_ID);

    const t = normalizeText(paragraphText(p));
    if (t === "MY COMMUTE") setParagraphText(p, PROJECT_TITLE);
    if (t === "(A STEP-BY-STEP TROTRO NAVIGATION SYSTEM)" || t === "(A STEP-BY-STEP TROTRO NAVIGATIONAL SYSTEM)") {
      setParagraphText(p, PROJECT_SUBTITLE);
    }

    // If the template uses standalone label paragraphs, replace them fully.
    if (t === "Student ID") setParagraphText(p, STUDENT_ID);
  }

  // Remove irrelevant sample figure citation text from the template.
  for (const p of paragraphs) {
    const t = paragraphText(p);
    if (/Cane Maps|Geocaching\.com|Before GPS and Geocaching/i.test(t)) {
      setParagraphText(p, "TBD");
    }
  }

  // 2) Front matter sections
  const dedication = "TBD (Write a brief dedication in your own words.)";
  const acknowledgement = "TBD (Acknowledge individuals/institutions that supported the project.)";
  const abstract = [
    "UrbanHub is a dual-application web platform consisting of a public storefront and a separate admin console, implemented with HTML/CSS/JavaScript and backed by Supabase for authentication and database persistence.",
    "On the storefront, users can browse a catalogue of products loaded from a Supabase ‘products’ table (including product name, category, price, image URL, and description). Users can open a product details page via a query parameter (e.g., product?id=...) and proceed to a checkout page.",
    "User authentication is implemented using Supabase Auth with email/password sign-up and sign-in. Pages that require an authenticated user (checkout and service appointment confirmation) use a shared authentication guard that checks for an active Supabase session and redirects unauthenticated users to the login page with a redirect-back URL.",
    "During checkout, the system persists an order record to an ‘orders’ table and logs a related entry in an ‘activity’ table. The services page implements a similar flow: selecting a service and confirming an appointment creates an order (type=service) and adds an activity log entry for administrative visibility.",
    "The admin console is a separate static web application that reads from the same Supabase backend. It loads and displays orders, products, recent activity, users (if present), and platform settings. Admin actions implemented in the repository include: approving an order (updates order status and logs an activity), adding a product, deleting a product, exporting orders as CSV, and updating platform settings in the ‘settings’ table.",
    "The relational schema for products, orders, activity, users, and settings is defined in SQL (supabase/schema.sql) and can be executed in Supabase to provision the required tables."
  ].join(" ");

  fillAfterHeading(paragraphs, "DEDICATION", dedication);
  fillAfterHeading(paragraphs, "ACKNOWLEDGEMENT", acknowledgement);
  fillAfterHeading(paragraphs, "ABSTRACT", abstract);
  fillAfterHeading(paragraphs, "LIST OF TABLES", "TBD");

  // 3) Chapter 1
  fillAfterHeading(
    paragraphs,
    "1.1     Research Background",
    [
      "UrbanHub is implemented as a hybrid platform that combines an online product storefront with professional service appointment booking.",
      "The repository contains two related web applications: (1) a customer-facing storefront and (2) an administrative console for operational monitoring and basic management.",
      "From the storefront, users can browse products, view a product details page, authenticate using email/password, and complete a checkout flow. For services, users can select a service type and confirm an appointment; the booking is stored as an order record.",
      "From the admin console, an administrator can view orders and activity logs produced by customer actions and can perform management operations such as approving orders and managing product inventory."
    ].join(" ")
  );
  fillAfterHeading(
    paragraphs,
    "1.2     Research Problem",
    [
      "In the context of the UrbanHub concept, the problem addressed is the fragmentation that can occur when product discovery, service scheduling, and administrative oversight are handled in disconnected tools.",
      "Without an integrated approach, an operator may lack a consistent record of purchases, appointments, and key events, and customers may have to switch between different platforms for browsing, booking, and confirmation.",
      "This project implements an integrated workflow where purchases and bookings are stored as structured rows in an ‘orders’ table and important events are recorded in an ‘activity’ table so that the admin console can present recent actions and operational status."
    ].join(" ")
  );
  fillAfterHeading(
    paragraphs,
    "1.3     Research Methods",
    [
      "TBD (Describe your academic methods).",
      "Implementation evidence from the repository shows a prototype built as static web pages (HTML/CSS/JavaScript ES modules) that interact with Supabase services.",
      "Both the storefront and admin console use the Supabase JavaScript client to perform database operations (select/insert/update/delete) against the tables defined in supabase/schema.sql, and the storefront uses Supabase Auth for email/password authentication."
    ].join(" ")
  );
  fillAfterHeading(
    paragraphs,
    "1.4     Research Purpose",
    "The purpose of this project is to design and implement a working prototype of an e-commerce storefront and service booking system (UrbanHub) with a supporting admin console and a persistent backend schema."
  );
  fillAfterHeading(
    paragraphs,
    "1.5     Research Objectives",
    [
      "The objectives implemented in this repository include:",
      "• Build a storefront product grid sourced from a Supabase ‘products’ table.",
      "• Provide a product details page that resolves products by query parameter and renders related items.",
      "• Implement email/password authentication (sign up and sign in) using Supabase Auth.",
      "• Gate checkout and service booking behind authentication, with redirect-back support.",
      "• Persist purchases and bookings into an ‘orders’ table and log actions into an ‘activity’ table.",
      "• Build an admin console to view and manage orders, products, activity, and platform settings.",
      "• Provide scripts to serve the storefront and admin console as separate local servers (via package.json scripts)."
    ].join("\n")
  );
  fillAfterHeading(
    paragraphs,
    "1.6     Research Significance",
    "The project demonstrates how a single, lightweight web codebase can deliver both a customer-facing experience and an operational dashboard backed by the same database schema. It highlights end-to-end flows (catalogue → authentication → checkout/booking → admin visibility) and provides a foundation that can be hardened for production (e.g., enabling RLS policies and restricting anonymous privileges)."
  );
  fillAfterHeading(
    paragraphs,
    "1.7     Research Limitations",
    [
      "This repository represents a demo/prototype environment.",
      "The included SQL schema grants broad privileges to anon/authenticated roles and explicitly disables row level security for immediate functionality.",
      "In the admin portal, the login page performs a client-side redirect without credential verification (the login flow is not connected to Supabase Auth in this repository).",
      "Additionally, some admin profile/password actions are explicitly disabled and show messages indicating authentication was removed from those specific features."
    ].join(" ")
  );
  fillAfterHeading(
    paragraphs,
    "1.8     Chapter Outline",
    "Chapter 1 introduces the project context, problem statement, objectives, significance, and limitations. Chapter 2 covers background and related concepts (to be supported with citations). Chapter 3 describes the chosen methodology. Chapter 4 presents analysis and design (requirements, database, and architecture). Chapter 5 documents implementation details. Chapter 6 concludes the work and provides recommendations."
  );

  // 4) Chapter 2 (keep conservative to avoid non-repo claims)
  fillAfterHeading(
    paragraphs,
    "2.1     Introduction",
    "This chapter should review existing approaches and technologies relevant to building a combined storefront and service-booking platform. (TBD: add academic and industry sources and cite them appropriately.)"
  );
  fillAfterHeading(
    paragraphs,
    "2.2     Section Two",
    "TBD (Suggested scope: e-commerce storefront patterns, product catalogue presentation, and checkout flow design—supported by citations.)"
  );
  fillAfterHeading(
    paragraphs,
    "2.3.1   Sub-Section",
    "TBD"
  );
  fillAfterHeading(
    paragraphs,
    "2.3.2   Sub-Section Two",
    "TBD"
  );
  fillAfterHeading(
    paragraphs,
    "2.4     Section Four",
    "TBD (Suggested scope: backend-as-a-service usage for rapid prototyping, and database schema considerations.)"
  );

  // 5) Chapter 3 Methodology
  fillAfterHeading(
    paragraphs,
    "3.1     Introduction",
    "This chapter describes the methodology used to design and build UrbanHub. Where academic methods are required (e.g., SDLC model selection), the details should be completed by the student to match the project’s actual process."
  );
  fillAfterHeading(
    paragraphs,
    "3.2     Section",
    "TBD (Describe chosen SDLC / development approach and how requirements were gathered.)"
  );
  fillAfterHeading(
    paragraphs,
    "3.2.1   Sub-Sections",
    [
      "Tools/stack used in the repository (implementation evidence):",
      "• Front-end: HTML, CSS, and JavaScript ES modules.",
      "• Backend services: Supabase Auth (email/password) and Supabase Postgres tables accessed via the Supabase JavaScript client.",
      "• Local serving: package.json provides scripts to serve the storefront on port 3000 and the admin portal on port 3001 using ‘serve’, and a combined start script using ‘concurrently’."
    ].join("\n")
  );
  fillAfterHeading(
    paragraphs,
    "3.2.2   Objectives of Solution",
    "The implemented solution provides a storefront (catalogue + product detail + checkout), an authentication workflow, a service booking flow, and an admin console to monitor and manage orders, products, activity, and platform settings, all backed by a shared Supabase database schema."
  );
  fillAfterHeading(
    paragraphs,
    "3.3     Sections",
    "TBD (Suggested scope: testing/validation approach used for the prototype.)"
  );

  // 6) Chapter 4 Systems Analysis and Design
  fillAfterHeading(
    paragraphs,
    "4.1     Introduction",
    "This chapter analyses UrbanHub’s requirements and presents the design of the system components (storefront, admin console, and Supabase database)."
  );
  fillAfterHeading(
    paragraphs,
    "4.2     Sections",
    [
      "System overview (as implemented in the repository):",
      "• Storefront pages:",
      "  - index.html: loads products from Supabase and renders product cards linking to product?id=...",
      "  - product.html: fetches a single product and shows related products; builds a checkout link containing product id + quantity.",
      "  - services.html: displays selectable services and provides an appointment confirmation action (handled in script.js).",
      "  - auth.html + auth.js: supports login and sign-up with Supabase Auth and a redirect-back mechanism.",
      "  - checkout.html: requires authentication; persists a new order row and an activity log entry.",
      "• Shared auth utilities: auth-guard.js provides getSession, requireAuth (redirect to auth?redirect=...), signOut, and navbar profile state.",
      "• Admin console: admin_portal/index.html + admin_portal/admin.js loads orders, products, users, activity, and settings; provides approve/delete/add/export/save-settings actions.",
      "• Backend: Supabase configuration in supabase-config.js and a SQL schema in supabase/schema.sql.",
      "",
      "Database tables (from supabase/schema.sql):",
      "• products(id, name, category, price, img, desc, created_at)",
      "• orders(id, userId, customer, product, amount, status, type, productId, bookingDate, bookingTime, created_at)",
      "• activity(id, title, desc, time, color, created_at)",
      "• users(id, uid, name, email, role, created_at)",
      "• settings(id, supportEmail, phone, address, maintenanceMode, updatedAt)",
      "",
      "Core data flow (implemented):",
      "• Catalogue read: storefront queries products and renders them as cards.",
      "• Authentication: user signs up or signs in; session is checked via supabase.auth.getSession().",
      "• Checkout/booking: a logged-in user creates an order row; a corresponding activity row is inserted for admin visibility.",
      "• Admin visibility: admin console reads orders/activity and performs updates (e.g., approve order)."
    ].join("\n")
  );

  // 7) Chapter 5 Implementation
  fillAfterHeading(
    paragraphs,
    "5.1     Introduction",
    "This chapter documents how the UrbanHub prototype is implemented in the repository, including key modules, database operations, and admin workflows."
  );
  fillAfterHeading(
    paragraphs,
    "5.2.1   Sub-Sections",
    [
      "Key implementation points (verifiable from source):",
      "• Supabase client: supabase-config.js creates a client via the Supabase JS CDN and is imported across pages.",
      "• Authentication: auth.js uses supabase.auth.signUp and supabase.auth.signInWithPassword; auth-guard.js provides requireAuth, getSession, and initNavAuth.",
      "• Product catalogue: script.js queries products (select * from products, ordered by created_at) and renders cards linking to product?id=...",
      "• Product details: product.html resolves product IDs using multiple candidate fields (id, product_id, productid) and renders a related-products section.",
      "• Checkout (product purchase): checkout.html requires authentication; it reads product info, calculates subtotal/tax/total, inserts a row into orders (type=product), and inserts a row into activity (title: New Purchase).",
      "• Service booking: services.html uses the booking widget UI and, on confirmation, inserts a row into orders (type=service) and inserts a row into activity (title: Service Booked).",
      "• Admin operations: admin_portal/admin.js loads orders/users/products/activity/settings; supports approve (orders.status → completed + activity log), delete product (products.delete), add product (products.insert), export orders to CSV, and save platform settings (settings.upsert + activity log).",
      "",
      "Additional note:",
      "• cart-manager.js implements a localStorage cart (key: urbanhub_cart) with helper functions (add/update/remove/totals). In the current codebase it is not imported by other modules."
    ].join("\n")
  );

  // 8) Chapter 6 Conclusion
  fillAfterHeading(
    paragraphs,
    "6.1     Introduction",
    "This chapter summarizes what was built and discusses future improvements for a production-ready release."
  );
  fillAfterHeading(
    paragraphs,
    "6.2     Conclusions",
    "UrbanHub demonstrates a working prototype that combines product commerce and service appointment booking in a single web experience, supported by an admin console and a shared Supabase database schema. The implemented flows include: catalogue rendering from a database table, email/password authentication with redirect-back behavior, gated checkout and booking actions, persistence of orders and activity logs, and administrative monitoring and basic management actions in a separate console."
  );
  fillAfterHeading(
    paragraphs,
    "6.3     Recommendations",
    "For production hardening, enable row level security (RLS) and add appropriate policies for each table, remove broad anon privileges, implement real admin authentication/authorization, and avoid embedding publishable keys in contexts where elevated permissions are granted."
  );

  // REFERENCES section placeholder
  fillAfterHeading(paragraphs, "REFERENCES", "TBD (Add your citations here in the required referencing style.)");

  const updatedXml = new XMLSerializer().serializeToString(dom);
  zip.file(docXmlPath, updatedXml);

  const outBuf = await zip.generateAsync({ type: "nodebuffer" });
  fs.writeFileSync(OUTPUT_PATH, outBuf);

  console.log(`Wrote: ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
