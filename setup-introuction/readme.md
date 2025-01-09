# Healthcare System

This is a modern Healthcare System web application built with Next.js 15, Tailwind CSS, Shadcn UI components, Clerk, Prisma ORM, and a PostgreSQL database. The system is designed to streamline hospital management operations, providing features like Role-Based Access Control (RBAC), appointment scheduling, laboratory management, staff management, and more.

---

## Features

### 1. **Role-Based Access Control (RBAC):**

- **Admin:** Manage users, view records, manage appointments, handle leave requests, and oversee all system functionalities.
- **Doctors:** View and manage appointments, update patient records, and track leave requests.
- **Patients:** Book and manage appointments, view medical history, and access lab results.
- **Laboratory Staff:** Manage and record test results and maintain laboratory inventory.

### 2. **Staff Management:**

- Add and manage different staff roles (nurses, doctors, and other staff members).
- Assign specific roles and responsibilities.

### 3. **Appointment Management:**

- Patients can book appointments with available doctors.
- Doctors can accept or cancel appointments.
- Admin can monitor all appointments.

### 4. **Laboratory Management:**

- Record and update test results.
- Link lab tests to patient records.

### 5. **Leave Management:**

- Staff members can apply for leave.
- Admin can approve, modify dates or reject leave requests.

### 6. **Modern Dashboards:**

- Tailored dashboards for each user type, displaying relevant information and analytics.

---

## Technology Stack

- **Frontend:** Next.js 15, Tailwind CSS, Shadcn UI
- **Backend:** Next.js Server Actions, Prisma ORM
- **Database:** PostgreSQL (Cloud-Based)
- **User Management:** Clerk

---

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Cloud-based PostgreSQL Database (e.g., Supabase, Neon, or similar)
- Clerk account for user management

### Installation

1. **Open the zip file:**

   ```
   Unzip and open the file in any code editor
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables:**
   Create a `.env` or rename `.env.example` file in the root of the project and add the following:

   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your clerk publishable key
   CLERK_SECRET_KEY=clerk secrek key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    DATABASE_URL="postgres database url"
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=cloudinary cluster name for image uploading
   ```

Replace the placeholders with your cloud-based PostgreSQL credentials and Clerk keys. For Clerk, you can find these keys in your Clerk dashboard.

4. **Setup Prisma:**

- Generate Prisma Client:

  ```bash
  npx prisma generate
  ```

- Run Database Migrations:
  ```bash
  npx prisma migrate dev --name init
  ```

5. **Run the Development Server:**

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## Database Configuration

Ensure your cloud-based PostgreSQL database is configured and accessible. Create a new database using your preferred database management tool or CLI:

```sql
CREATE DATABASE healthcare_db or nay name;
```

Update the `DATABASE_URL` in the `.env` file with your cloud-based PostgreSQL credentials.

---

## Clerk Configuration

1. Sign up for a [Clerk account](https://clerk.dev/).
2. Create a new Clerk project.
3. Copy the **Frontend API** and **API Keys** from your Clerk project settings.
4. Update the `.env` file with the following values:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your clerk publishable key
    CLERK_SECRET_KEY=clerk secrek key
   ```

## Prisma Setup

1. **Prisma Schema:**
   The Prisma schema is located in `prisma/schema.prisma`. You can update this file to define your database models and relationships.

2. **Migrate Database:**

   ```bash
   npx prisma migrate dev --name init
   ```

3. **Prisma Studio:**
   To view and manage your database:
   ```bash
   npx prisma studio
   ```

---

## Project Structure

- **`app/`**: Contains the Next.js pages.
- **`components/`**: Reusable UI components built with Shadcn UI.
- **`prisma/`**: Prisma schema and migrations.
- **`lib/`**: Utility functions and configurations.
- **`utils/`**: Utility functions and configurations.

---

## Deployment

1. **Build for Production:**

   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Start the Production Server:**
   ```bash
   npm start
   # or
   yarn start
   ```

---

## Refund Policy

There is no refund after purchase of the product (code).

---

## License

This project was developed by Codewave, feel free to use it for anything of choice.

```

&nbsp;

## CAUTION:

This code is not tested vigorously for production, and it may contain some bugs. so be well

## For Support, Contact:

In case of any bug or error relating to the original code, please contact the Codewave for assistance. You can also contact for customizations but note that, that will comeat a cost.

- Email: codewavewithasante@gmail.com
- Telegram Chat: [https://t.me/Codewave_with_asante](https://t.me/Codewave_with_asante)
```
