# Exclusive Fashions Ltd - Next.js E-commerce Platform

This is a full-stack e-commerce application for "Exclusive Fashions Ltd" built with Next.js, Supabase, and Tailwind CSS.

## Features

- **Storefront**: Landing page, product listings with filtering/sorting, product detail pages, and a contact page.
- **Admin Dashboard**: A secure area at `/admin` for managing products, categories, and site settings.
- **Authentication**: Supabase Auth for the admin dashboard with role-based access control.
- **Database**: Postgres via Supabase, with a full schema and Row Level Security policies.
- **Styling**: Styled with Tailwind CSS and shadcn/ui, featuring a modern, mobile-first design.

## Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Docker (for local Supabase development, optional but recommended)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### 2. Set up Supabase

You can use a hosted Supabase project or run it locally.

**a) Hosted Supabase Project:**

1.  Go to [supabase.com](https://supabase.com) and create a new project.
2.  In your project dashboard, navigate to **SQL Editor** and click **New query**.
3.  Copy the entire content of `supabase/migrations/0000_initial_schema.sql` into the editor and click **RUN**. This will create all the necessary tables, functions, and policies.
4.  Navigate to **Project Settings** > **API**. Find your **Project URL** and **Project API keys** (the `anon` `public` key).

**b) Local Supabase Development:**

1.  Initialize Supabase in your project directory:
    ```bash
    supabase init
    ```
2.  Start the Supabase services:
    ```bash
    supabase start
    ```
3.  Link your local instance to your project:
    ```bash
    supabase link --project-ref <your-project-id>
    # You can get your project ID from your Supabase project's URL
    ```
4.  Apply the database migrations:
    ```bash
    supabase db push
    ```
    This will execute the SQL script in `supabase/migrations`.
5.  The CLI will output your local Supabase URL and keys.

### 3. Environment Variables

1.  Create a `.env.local` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env.local
    ```
2.  Fill in the values with your Supabase URL and anon key:
    ```
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
    ```

### 4. Install Dependencies

Install the project dependencies using npm:
```bash
npm install
```

### 5. Run the Development Server

Start the Next.js development server:
```bash
npm run dev
```
The application will be available at [http://localhost:9002](http://localhost:9002).

## Admin Access

### 1. Create an Admin User

1.  Navigate to your Supabase project's **Authentication** section.
2.  Click **Add user** and create a new user with an email and password.

### 2. Assign the 'owner' Role

1.  Navigate to the **Table Editor** and select the `profiles` table.
2.  You should see a new row created for the user you just added.
3.  Edit the `role` column for that user and set it to `owner`.

### 3. Log In

1.  Go to the admin login page at [http://localhost:9002/admin/login](http://localhost:9002/admin/login).
2.  Log in with the credentials you created. You will be redirected to the admin dashboard at `/admin`.

You now have full access to the admin dashboard, including the ability to manage products, categories, and site settings.
