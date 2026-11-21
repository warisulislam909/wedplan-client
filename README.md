# WedPlan — Wedding Planning Platform (Client)

WedPlan lets customers discover wedding services and request bookings, vendors publish services and manage requests (with a Premium subscription), and admins manage users, services and transactions.

- **Live Website:** `https://your-site.vercel.app`
- **Client Repository:** `https://github.com/<you>/wedplan-client`
- **Server Repository:** `https://github.com/<you>/wedplan-server`

## Important Features
- Home page with animated hero (Framer Motion), featured services from the database, category explorer, "Why WedPlan" and "How it works"
- Browse Services: search by name, category and location filters, price sort (asc/desc), pagination, loading and empty states
- Service details with image gallery and booking form (private route, redirects to Sign In)
- Better Auth: email/password + Google, role selection (Vendor/Customer), password rules, blocked users cannot sign in
- Role-based dashboards with sidebar: **Vendor** (overview, my services, add service, booking requests, subscription, profile), **Customer** (overview, my bookings, profile), **Admin** (overview, users, services, transactions)
- Users cannot open another role's dashboard by changing the URL (client redirect + server-side role checks on every API)
- Stripe Checkout upgrade flow; Premium turns on only after the server receives a verified webhook
- ImgBB image uploads through a server route (API key never reaches the browser)
- Toast notifications (no `alert()`), responsive layout, custom 404 and error pages

## Technology Stack
Next.js 14 (App Router) · JavaScript · Tailwind CSS · ShadCN-style components (CVA + tailwind-merge) · Framer Motion · Better Auth · MongoDB · jose (JWT) · Sonner · Lucide icons · Stripe Checkout · ImgBB

## How Auth Works
Better Auth manages sessions in MongoDB (collection `users`, `session`, `account`). For API calls the client requests a 15-minute JWT from `/api/token` (only for a signed-in, unblocked user) and sends it as `Authorization: Bearer …` to the Express server, which verifies the token and re-loads the user's role from the database.

## Installation & Running Locally
```bash
git clone https://github.com/<you>/wedplan-client.git
cd wedplan-client
npm install
cp .env.example .env.local   # fill in the values
npm run dev                   # http://localhost:3000
```
Run the server repo at the same time (`http://localhost:5000`).

## Environment Variables
| Name | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Express API base, e.g. `http://localhost:5000/api` |
| `NEXT_PUBLIC_APP_URL` | Public URL of this app |
| `BETTER_AUTH_SECRET` | Long random secret for Better Auth |
| `BETTER_AUTH_URL` | Base URL of this app |
| `MONGODB_URI` / `MONGODB_DB` | Same database as the server |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `JWT_SECRET` | **Must equal the server's `JWT_SECRET`** |
| `IMGBB_API_KEY` | ImgBB key (server-side only) |

## Required Application URLs
- Google OAuth authorized redirect URI: `{BETTER_AUTH_URL}/api/auth/callback/google`
- Stripe webhook (server): `{API_DOMAIN}/api/payments/webhook`
- Stripe success/cancel pages: `/payment/success`, `/payment/cancel`

## Admin Access
Admins cannot be created via sign up. Register the admin email normally, then run `npm run make-admin -- <email>` in the server repo.

## Deployment Notes
Deploy on Vercel. Set every variable above, add the production domain to Google OAuth, set `CLIENT_URL` on the server to this domain (no CORS issues), and use the server's webhook URL in Stripe. Next.js App Router handles route reloads without 404s.
