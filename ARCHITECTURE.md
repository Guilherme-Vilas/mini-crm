# Project Architecture & Guidelines

## 1. Project Overview
Mini CRM developed with a focus on usability, modern design, and performance.
**Core Objective:** Manage leads via a Kanban pipeline with full CRUD, Auth, and History tracking.

## 2. Tech Stack
- **Frontend:** Next.js 14 (App Router), React, TypeScript.
- **Styling:** Tailwind CSS, Shadcn/UI (Radix Primitives).
- **State/Async:** TanStack Query (React Query) for caching and optimistic updates.
- **Backend:** Supabase (PostgreSQL, Auth, RLS).
- **Drag & Drop:** @dnd-kit/core (Vertical & Horizontal sorting).
- **Forms:** React Hook Form + Zod.

## 3. Data Schema (Supabase)
### Table: `leads`
- `id` (uuid, pk)
- `user_id` (uuid, fk -> auth.users)
- `name` (text, required)
- `company` (text, required)
- `phone` (text, masked)
- `email` (text, email validation)
- `status` (enum: 'new', 'contacted', 'negotiation', 'closed', 'lost')
- `source` (text)
- `created_at` (timestamp)

### Table: `interactions`
- `id` (uuid, pk)
- `lead_id` (uuid, fk -> leads)
- `type` (enum: 'call', 'email', 'meeting', 'note')
- `content` (text)
- `created_at` (timestamp)

## 4. UI/UX Rules
- **Optimistic UI:** Dragging a card must update UI immediately, then sync with DB.
- **Responsive:** Sidebar collapses on mobile. Kanban becomes vertical list or horizontal scroll.
- **Feedback:** Toasts (Sonner) for success/error actions.
- **Modals:** Use Sheet (Side drawer) for Lead Details; Dialog for Quick Actions.

## 5. Directory Structure
/src
  /app (Routes)
  /components
    /ui (Shadcn)
    /crm (Kanban, Cards, Forms)
  /hooks (Custom hooks for Supabase)
  /lib (Utils, Supabase client)
  /types (TS Interfaces)