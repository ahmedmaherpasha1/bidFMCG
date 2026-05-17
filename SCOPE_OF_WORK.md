# Scope of Work: FMCG Consumables Bidding Platform

## 1. Project Overview

A B2B web platform that enables consumable factories in the FMCG sector to list their products and allows other factories/buyers to bid on or purchase those consumables. The platform acts as a marketplace connecting suppliers (consumable manufacturers) with buyers (FMCG production facilities).

**Core Value Proposition:** Reduce procurement costs, increase supply chain transparency, and create competitive pricing through a structured bidding mechanism for industrial consumables.

---

## 2. Stakeholders

| Role | Description |
|------|-------------|
| **Supplier** | Consumable factory listing products for sale/bidding |
| **Buyer** | FMCG factory purchasing consumables through bids or direct buy |
| **Platform Admin** | Manages users, listings, disputes, and platform configuration |
| **Finance Team** | Monitors transactions, invoices, and commission settlement |

---

## 3. Consumable Categories in Scope

- Packaging materials (cartons, films, labels, bottles, caps)
- Cleaning & sanitation chemicals
- Lubricants & maintenance supplies
- Personal protective equipment (PPE)
- Office and production consumables
- Spare parts with limited shelf life
- Raw material additives (flavors, preservatives, colorants)

---

## 4. Core Modules

### 4.1 User & Company Management
- Company registration with trade license and verification workflow
- Role-based access: Admin, Supplier, Buyer, Finance
- Multi-user accounts per company with permission levels
- KYC/KYB document upload and approval by platform admin
- Supplier and buyer profile pages with ratings and history

### 4.2 Product Listing Management (Supplier)
- Create listings with: product name, category, unit, quantity available, specs, images, documents (MSDS, certificates)
- Set listing type: **Open Bid**, **Sealed Bid**, or **Buy Now**
- Define minimum order quantity (MOQ), delivery terms (Incoterms), and payment terms
- Set listing duration and automatic expiry
- Draft, publish, pause, and close listings
- Bulk listing via CSV import

### 4.3 Bidding Engine
- **Open Bid (English Auction):** Buyers see competing bids and can outbid in real time
- **Sealed Bid (Reverse Tender):** Buyers submit one blind bid; supplier picks the winner
- **Buy Now:** Fixed price, first-come-first-served
- Bid increment rules and minimum bid validation
- Auto-bid (proxy bidding) for open auctions
- Bid deadline with countdown timer
- Bid history visible to listing owner; masked for competing buyers in sealed mode
- Automatic winner notification on auction close
- Bid retraction policy (configurable per listing)

### 4.4 RFQ (Request for Quotation)
- Buyer posts an RFQ with specs, quantity, and deadline
- Suppliers submit quotes against RFQ
- Buyer compares quotes and awards to preferred supplier
- RFQ can be public (visible to all suppliers) or private (invited suppliers only)

### 4.5 Order & Contract Management
- Auto-generated purchase order on bid win or Buy Now
- Digital contract generation with terms agreed during bidding
- Order status tracking: Confirmed -> In Production -> Dispatched -> Delivered -> Closed
- Delivery documentation upload (BOL, packing list, COA)
- Order amendment workflow with both-party approval

### 4.6 Payment & Settlement
- Escrow-based payment: buyer funds held until delivery confirmation
- Supported payment methods: bank transfer, letter of credit (LC), credit line
- Invoice generation (supplier) and payment confirmation (buyer)
- Platform commission deducted automatically on settlement
- Credit terms management (Net 30/60/90 configurable)
- Finance dashboard with aging reports and payment status

### 4.7 Ratings & Reviews
- Post-transaction rating: buyers rate suppliers and vice versa
- Dimensions: product quality, delivery accuracy, communication, packaging
- Ratings visible on company profiles
- Dispute flag to admin if rating is contested

### 4.8 Notifications & Alerts
- Email and in-app notifications for: new bids, outbid alerts, auction close, order updates, payment events
- Configurable notification preferences per user
- SMS alerts for critical events (bid won, payment due)

### 4.9 Admin Panel
- User and company approval/rejection/suspension
- Listing moderation and takedown
- Dispute resolution workflow
- Commission rate configuration per category
- Platform analytics: GMV, active listings, bid conversion rate, top buyers/suppliers
- Audit log for all critical actions

---

## 5. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | Page load < 2s; bid submission < 500ms under peak load |
| **Scalability** | Support 10,000 concurrent users; horizontally scalable services |
| **Availability** | 99.9% uptime SLA; no downtime during active auctions |
| **Security** | OWASP Top 10 compliance; data encryption at rest and in transit; MFA for admin accounts |
| **Compliance** | GDPR-ready; invoice/contract archiving for 7 years |
| **Localization** | Arabic + English UI; currency: USD, EGP, SAR (configurable) |
| **Accessibility** | WCAG 2.1 AA |

---

## 6. Technical Architecture

### Stack
- **Frontend:** React (Next.js) — SSR for SEO on public listings
- **Backend:** Java 17 + Spring Boot 3 — core API services
- **Bidding Service:** Event-driven via Kafka for real-time bid processing
- **Database:** PostgreSQL (transactional data), Redis (sessions, bid cache, real-time counters)
- **File Storage:** S3-compatible object storage for documents and images
- **Search:** Elasticsearch for listing search and filtering
- **Notifications:** WebSocket (in-app), SMTP (email), SMS gateway
- **Auth:** JWT + refresh tokens; OAuth2 for SSO (optional)

### Deployment
- Docker containers orchestrated via Kubernetes
- CI/CD pipeline with automated tests and staging deployment
- Separate environments: Development, Staging, Production

---

## 7. Integrations

| Integration | Purpose |
|-------------|---------|
| Payment gateway (e.g., Stripe, Paymob, Payfort) | Online payment processing |
| E-signature provider (e.g., DocuSign, Yousign) | Digital contract signing |
| ERP/SAP connector (REST API) | Purchase order sync for enterprise buyers |
| Logistics provider APIs | Shipment tracking |
| Email service (SendGrid / SES) | Transactional emails |
| SMS gateway (Twilio / local provider) | Critical alerts |

---

## 8. Deliverables

| # | Deliverable |
|---|-------------|
| 1 | System design document and ER diagram |
| 2 | API specification (OpenAPI 3.0) |
| 3 | Frontend application (Next.js) |
| 4 | Backend microservices (Spring Boot) |
| 5 | Admin dashboard |
| 6 | CI/CD pipeline configuration |
| 7 | Infrastructure-as-code (Docker Compose / Helm charts) |
| 8 | Test suite (unit + integration, min 80% coverage) |
| 9 | User manuals for Supplier, Buyer, and Admin roles |
| 10 | Production deployment and handover |

---

## 9. Phases & Milestones

### Phase 1 — Foundation (Weeks 1–4)
- User registration, KYB verification, role management
- Basic product listing CRUD
- Platform infrastructure setup

### Phase 2 — Bidding Core (Weeks 5–9)
- Open bid and Buy Now auction engine
- Real-time bid updates via WebSocket/Kafka
- Bid history, winner selection, notifications

### Phase 3 — Orders & Payments (Weeks 10–14)
- Purchase order generation
- Escrow payment flow
- Delivery tracking and confirmation

### Phase 4 — RFQ & Advanced Features (Weeks 15–18)
- RFQ module
- Sealed bid support
- Auto-bid (proxy) engine
- Ratings and reviews

### Phase 5 — Admin, Analytics & Launch (Weeks 19–22)
- Admin panel with dispute resolution
- Platform analytics dashboard
- Performance testing and security audit
- Production deployment

---

## 10. Out of Scope

- B2C retail sales
- Physical logistics management (third-party logistics are integrated via API only)
- Manufacturing ERP functionality
- Customs clearance processing
- Mobile native apps (web responsive only in v1)

---

## 11. Assumptions

- Suppliers are pre-vetted FMCG-sector consumable manufacturers.
- Buyers are registered factory entities with valid trade licenses.
- Platform operates in an escrow model; physical delivery is handled by the supplier.
- All legally binding contracts are governed by the jurisdiction agreed in platform terms.
- Initial launch targets Egypt and GCC markets.

---

## 12. Risks

| Risk | Mitigation |
|------|------------|
| Bid sniping (last-second bids) | Extend auction by 5 min on late bids |
| Fraudulent listings | KYB verification + admin moderation |
| Payment defaults | Escrow holds funds before order confirmation |
| Low liquidity in early stage | Invite-only onboarding of anchor suppliers and buyers |
| Real-time bid conflicts | Optimistic locking + Kafka event ordering |
