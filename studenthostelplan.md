This plan is structured to build features in a dependent order, starting with the admin foundation and then building the student-facing application on top of it.

Project Blueprint: Hostel Management System
Core Technologies:

Framework: Next.js 14+ (App Router)

Styling: Tailwind CSS

State Management: Zustand

Data Fetching/Caching: React Query (TanStack Query)

Forms: React Hook Form

Notifications: React Hot Toast

Database: MongoDB (with Mongoose)

Image Hosting: Cloudinary

Payments: M-Pesa API

Authentication: NextAuth.js

Phase 0: Setup and Database Modeling
This foundational phase is about preparing the entire project structure and defining how data will be stored.

1. Project Initialization:

Set up Next.js with the App Router.

Install and configure Tailwind CSS, React Query, Zustand, React Hook Form, Mongoose, Cloudinary SDK, and NextAuth.js.

Establish your folder structure (e.g., /app, /components, /lib, /models).

2. Database Schema Design (in /models):

User.js (Authentication):

JavaScript

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' }
}, { timestamps: true });
StudentInfo.js (Detailed Profile):

JavaScript

const studentInfoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  // ... all other personal fields: (gender,Homecounty,location,formerhighschool,mothersname,mothersnumber,fathersname,fathersnumber,guardiannumber,guradianname,schoool,course)
}, { timestamps: true });
Room.js:

JavaScript
   <!-- roominfoSchema -->
const roomSchema = new mongoose.Schema({
  block: { type: String, required: true }, // e.g., 'A'
  roomNumber: { type: String, required: true }, // e.g., 'A101'
  gender: { type: String, enum: ['Male', 'Female',], required: true },
  capacity: { type: Number, required: true },
  photoUrls: [{ type: String }],
  price: { type: Number, required: true }, // Price per month
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});
// Create a compound index to ensure room numbers are unique within a block
roomSchema.index({ block: 1, roomNumber: 1 }, { unique: true });
Booking.js:

JavaScript

const bookingSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentInfo', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  status: { type: String, enum: ['pending', 'allocated', 'rejected'], default: 'pending' }
}, { timestamps: true });
Occupancy.js (The "Allocation" record):

JavaScript

const occupancySchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentInfo', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  moveInDate: { type: Date, default: Date.now },
  expectedMoveOutDate: { type: Date },
  isActive: { type: Boolean, default: true } // Becomes false when student moves out
});
Payment.js:

JavaScript

const paymentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentInfo', required: true },
  occupancyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Occupancy', required: true },
  amount: { type: Number, required: true },
  mpesaTransactionId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['completed', 'failed'], default: 'completed' },
}, { timestamps: true });
Balance.js:

JavaScript

const balanceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentInfo', required: true, unique: true },
    currentBalance: { type: Number, default: 0 } // Can be negative (overpayment) or positive (due)
});
Phase 1: Admin Panel & Room Management ⚙️
Focus entirely on the admin experience first.

Pages & Components:

/app/admin/login: Admin-specific login page.

/app/admin/dashboard: Main layout for the admin panel.

/app/admin/dashboard/rooms: Page to display all rooms in a table.

/app/admin/dashboard/rooms/add: Page with a form to add a new room.

/app/admin/dashboard/rooms/edit/[roomId]: Page to edit an existing room.

Component: <RoomForm> (using React Hook Form) for adding/editing rooms.

Component: <RoomsDataTable> to display, sort, and filter rooms.

API Endpoints (/app/api/...):

POST /api/auth/admin-login: Special login for admin roles.

POST /api/rooms: Create a new room (uploads photos to Cloudinary, gets URLs, then saves).

GET /api/rooms: Fetch all rooms for the admin table.

GET /api/rooms/[roomId]: Fetch a single room's details for editing.

PUT /api/rooms/[roomId]: Update a room's details.

DELETE /api/rooms/[roomId]: Delete a room (or better, change its status to 'inactive').

Phase 2: Student Onboarding & Room Discovery 🧑‍🎓
Implement the student's initial journey.

Pages & Components:

/app/(auth)/login: Student login page.

/app/(auth)/register: Student registration page (only email and password).

/app/(student)/rooms: The main gallery page where students see available rooms.

/app/(student)/rooms/[roomId]: Detailed view of a single room with photos and info.

/app/(student)/book/[roomId]: The protected route for filling out detailed personal info (StudentInfo).

Component: <RoomCard> for the rooms gallery.

Component: <StudentInfoForm> (using React Hook Form) on the /book/[roomId] page.

API Endpoints:

POST /api/auth/register: Create a new user with the 'student' role.

GET /api/rooms/available: Crucial endpoint. This fetches all rooms (status: 'active') and joins with the Occupancy collection to calculate current occupancy. It only returns rooms where capacity > currentOccupancy.

POST /api/bookings: This is triggered after the student submits the StudentInfoForm. It does two things in a single transaction:

Creates or updates the StudentInfo document.

Creates a new Booking document with status: 'pending'.

Phase 3: Booking Allocation & Profile Management 🔄
Connect the admin's actions to the student's status.

Pages & Components:

/app/admin/dashboard/bookings: New admin page to view all pending booking requests.

/app/(student)/profile: The student's main dashboard. Initially shows the "pending allocation" message. Later shows allocated room and payment info.

Component: <BookingRequestCard> for the admin to see who wants to book which room.

Component: <ProfileStatus> on the student profile to show different states (pending, allocated, payment due).

API Endpoints:

GET /api/bookings/pending: Fetches all bookings with status: 'pending', populating student and room details.

POST /api/allocations: Admin-only. Triggered when an admin approves a booking.

Receives bookingId, studentId, roomId.

Updates the Booking status to allocated.

Creates a new Occupancy record.

Creates a new Balance record for the student, setting the initial balance to the room's price.

Triggers an email to the student notifying them of the allocation.

GET /api/users/profile: Fetches the logged-in student's User, StudentInfo, Booking, Occupancy, and Balance data to populate their profile page.

Phase 4: M-Pesa Payments & Financial Tracking 💳
Implement the full payment lifecycle.

Pages & Components:

/app/admin/dashboard/payments: Admin page to view a ledger of all transactions.

/app/admin/dashboard/finances: Admin page to view student balances.

Component: <PaymentModal> on the student profile. This is where the M-Pesa flow begins.

Component: <PaymentHistory> on the student profile.

Component: <StudentBalanceView> on the admin finance page.

API Endpoints:

POST /api/payments/mpesa/stk-push: Student-facing. Takes an amount and phoneNumber, initiates the STK push via M-Pesa API, and stores a temporary transaction record.

POST /api/payments/mpesa/callback: Public-facing but secured. This is the callback URL you provide to M-Pesa. When a payment is completed, M-Pesa sends the results here.

Verifies the data from M-Pesa.

If successful, creates a new Payment document.

Updates the student's Balance document (currentBalance -= amountPaid).

Sends a confirmation email/notification.

GET /api/payments: Admin-only. Fetches all payment records.

GET /api/balances: Admin-only. Fetches all student balances.

Automation (Bonus):

Set up a monthly cron job (using services like Vercel Cron Jobs or a simple scheduler). This job runs on the 1st of every month:

It finds all active occupancies.

For each one, it updates the corresponding student's Balance by adding the monthly room price (currentBalance += room.price).

Key Considerations for a Production-Ready App:
Error Handling: Implement robust error handling on the client (e.g., toast notifications for failed API calls) and server (proper try-catch blocks and error responses).

Security: Use NextAuth.js middleware to protect all sensitive routes (/admin/*, /profile). Validate all API inputs rigorously to prevent injection attacks. Never trust client-side data.

Email: Use a reliable email service like Resend or SendGrid for sending transactional emails (allocation, payment confirmation).

Performance: Use React Query's caching to avoid re-fetching data unnecessarily. Use next/image for optimized image loading from Cloudinary. Paginate large data sets in admin tables.