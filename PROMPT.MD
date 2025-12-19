# Role & Context
You are a Principal Software Engineer aiming to ace a high-stakes technical test. The goal is to build a "Mini CRM" that is not just functional, but architecturally perfect, visually stunning, and ready for production deployment on Vercel.

# Project Constraints & Stack (STRICT)
- **Framework:** Next.js 14+ (App Router, TypeScript).
- **Styling:** Tailwind CSS + **Shadcn/UI** (Simulate the code for: Button, Card, Input, Label, Select, Dialog, Sheet, Table, Badge, Avatar, ScrollArea, Toaster).
- **Icons:** Lucide React.
- **Backend/Auth:** Supabase (Auth with RLS + Database).
- **State/Async:** TanStack Query (v5) for caching and optimistic updates.
- **Drag & Drop:** `@dnd-kit/core` + `@dnd-kit/sortable` (Must be smooth and mobile-optimized).
- **Forms:** React Hook Form + Zod (Strict validation).
- **Utils:** `papaparse` (CSV Import), `xlsx` (Excel Export), `date-fns`.

# Database Schema (Source of Truth)
Assume the Supabase database has these exact tables. Generate TypeScript interfaces based strictly on this:
1. `leads` (
   id: uuid pk,
   user_id: uuid (fk auth.users),
   name: text,
   email: text,
   phone: text,
   company: text,
   role: text,
   status: 'new' | 'contacted' | 'negotiation' | 'closed' | 'lost',
   source: text,
   created_at: timestamp
)
2. `interactions` (
   id: uuid pk,
   lead_id: uuid (fk leads),
   type: 'call' | 'email' | 'meeting' | 'note',
   content: text,
   created_at: timestamp
)

# Core Features Requirements
1. **Auth Barrier:** Clean Login/Register pages. Protected routes via Middleware.
2. **Kanban Board (The "Wow" Factor):**
   - Columns based on Status.
   - Drag & Drop with Optimistic UI (update UI instantly, revert if server fails).
   - Cards show: Name, Company, Badge (Role), and relative time (e.g., "2 days ago").
3. **Smart Data Entry:**
   - "New Lead" Modal: Phone input MUST apply mask `(99) 99999-9999` automatically.
   - CSV Import: Validate headers. If valid, bulk insert to Supabase.
   - Excel Export: Download filtered data instantly.
4. **Lead Details & History:**
   - Clicking a card opens a "Sheet" (Side Drawer).
   - Show Lead metadata at the top.
   - Show a vertical Timeline of interactions below.
   - Allow adding a new note/interaction directly in the Sheet.

# UX/UI & Responsiveness Guidelines
- **Theme:** "Modern SaaS". Background `bg-slate-50`, clean white cards with subtle shadows (`shadow-sm`), primary color Indigo or Violet.
- **Mobile Experience:** CRITICAL. On mobile, the Kanban columns should be in a horizontal scroll container (Snap scroll) OR strictly vertical stacked tabs. Do NOT break the layout on small screens.
- **Feedback:** Use "Sonner" or "Toaster" for every success/error action.

# Execution Plan
1. Create the Supabase client helper (`utils/supabase/client.ts` & `server.ts`).
2. Create the Zod Schemas for Leads and Interactions.
3. Build the Auth pages (Login/Signup).
4. Build the Dashboard Shell (Sidebar + Topbar + UserProfile).
5. Build the Kanban Board components (Column, Card, Board).
6. Implement the Drag & Drop logic with TanStack Query mutations.
7. Implement the "Lead Details Sheet" with Interaction Timeline.

**Action:** Start by scaffolding the project structure, setting up the Supabase Client, and creating the Types. Then proceed to the Auth pages.