# CIVIC RESOLVE - COMPREHENSIVE PROJECT DOCUMENTATION

## Smart Civic Complaint Management System

---

# 1. PROBLEM STATEMENT

## Current Problems Citizens Face

### 1.1 Difficulty in Reporting Issues
- **No Centralized Platform**: Citizens must visit multiple government offices or call different helpline numbers
- **Time-Consuming Process**: Physical visits require taking time off work, waiting in long queues
- **Lack of Digital Access**: Many existing systems are not user-friendly or mobile-responsive
- **Language Barriers**: Most systems only support English, excluding non-English speakers

### 1.2 Lack of Transparency
- **Black Box System**: Citizens submit complaints but have no visibility into the resolution process
- **No Status Updates**: No notifications about complaint progress or estimated resolution time
- **Anonymous Handling**: Citizens don't know which officer is handling their complaint
- **No Accountability**: No way to track if complaints are being addressed promptly

### 1.3 Delay in Issue Resolution
- **Manual Routing**: Complaints get lost in bureaucratic channels
- **No Prioritization**: Critical issues (like water contamination) treated same as minor issues
- **Resource Mismanagement**: Authorities unaware of issue severity and location clustering
- **Communication Gaps**: Back-and-forth between departments delays resolution

### 1.4 No Centralized Complaint Tracking System
- **Duplicate Complaints**: Same issue reported multiple times by different citizens
- **No Historical Data**: Unable to identify recurring problem areas
- **No Analytics**: Municipalities cannot plan preventive maintenance
- **Citizen Frustration**: No record of past complaints for reference

## Why Civic Resolve is Needed

Civic Resolve addresses all these pain points by providing:
- **Single Digital Platform**: One-stop solution for all civic complaints
- **Real-time Tracking**: Complete visibility from submission to resolution
- **Direct Communication**: Citizens can communicate directly with assigned officers
- **Data-Driven Decisions**: Analytics help authorities prioritize and plan
- **Mobile-First Design**: Accessible to all citizens regardless of technical expertise

---

# 2. OBJECTIVES

## Primary Objectives

### 2.1 Empower Citizens
- **Easy Reporting**: Simple 3-step complaint submission process
- **Anytime, Anywhere**: 24/7 access via web and mobile
- **Multilingual Support**: Interface in local languages
- **Offline Capability**: Save drafts when network is unavailable

### 2.2 Provide Real-Time Tracking
- **Live Status Updates**: Push notifications at every stage
- **Visual Timeline**: Progress bar showing complaint journey
- **Estimated Resolution Time**: AI-powered predictions based on issue type and location
- **Officer Assignment**: Know exactly who is handling the complaint

### 2.3 Improve Communication
- **Two-Way Messaging**: Citizens and officers can chat within the platform
- **Photo Evidence**: Upload additional images during resolution process
- **Feedback System**: Rate resolution quality after completion
- **Escalation**: Auto-escalate unresolved complaints to higher authorities

### 2.4 Increase Transparency
- **Public Dashboard**: Anonymous view of all complaints in an area
- **Resolution Metrics**: Average resolution time by category
- **Officer Performance**: Public ratings of municipal staff
- **Audit Trail**: Complete history of all actions on a complaint

### 2.5 Improve City Infrastructure
- **Predictive Maintenance**: Identify problem areas before they escalate
- **Resource Optimization**: Deploy teams based on complaint clustering
- **Budget Planning**: Data-driven allocation of maintenance funds
- **Citizen Satisfaction**: Measure and improve public service quality

---

# 3. COMPLETE SYSTEM ARCHITECTURE

## 3.1 Technology Stack

### Frontend Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                           │
├─────────────────────────────────────────────────────────────┤
│  React.js 18+                                               │
│  ├── TypeScript (Type Safety)                               │
│  ├── Vite (Build Tool)                                      │
│  ├── Tailwind CSS (Styling)                                 │
│  ├── shadcn/ui (Component Library)                          │
│  ├── React Router (Navigation)                              │
│  ├── Axios (HTTP Client)                                    │
│  ├── React Query (State Management)                         │
│  └── Recharts (Data Visualization)                          │
└─────────────────────────────────────────────────────────────┘
```

### Backend Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  Node.js + Express.js                                       │
│  ├── JWT Authentication                                     │
│  ├── bcrypt (Password Hashing)                              │
│  ├── Multer (File Upload)                                   │
│  ├── Express Validator (Input Validation)                   │
│  ├── CORS (Cross-Origin)                                    │
│  ├── Helmet (Security)                                      │
│  └── Morgan (Logging)                                       │
└─────────────────────────────────────────────────────────────┘
```

### Database Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  MongoDB (NoSQL Database)                                   │
│  ├── Users Collection                                       │
│  ├── Complaints Collection                                  │
│  ├── StatusUpdates Collection                               │
│  ├── Categories Collection                                  │
│  └── Notifications Collection                               │
└─────────────────────────────────────────────────────────────┘
```

### Cloud Services
```
┌─────────────────────────────────────────────────────────────┐
│                   CLOUD SERVICES                            │
├─────────────────────────────────────────────────────────────┤
│  ├── Cloudinary (Image Storage)                             │
│  ├── Firebase Auth (Optional)                               │
│  └── Render/AWS (Deployment)                                │
└─────────────────────────────────────────────────────────────┘
```

## 3.2 System Flow Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   CITIZEN    │────▶│   FRONTEND   │────▶│   BACKEND    │
│   (Browser)  │◀────│   (React)    │◀────│   (Node.js)  │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                                  ▼
                                         ┌──────────────┐
                                         │   MONGODB    │
                                         │   Database   │
                                         └──────────────┘
                                                  │
                                                  ▼
                                         ┌──────────────┐
                                         │  CLOUDINARY  │
                                         │Image Storage │
                                         └──────────────┘
```

---

# 4. USER ROLES AND FEATURES

## 4.1 Citizen Features

### Authentication
- ✅ Email/Password Registration
- ✅ Login with JWT Token
- ✅ Password Reset
- ✅ Profile Management
- ✅ Social Login (Google)

### Complaint Management
- ✅ Submit New Complaint
  - Title (required)
  - Description (required)
  - Category selection (required)
  - Location with map picker (required)
  - Image upload (optional, max 5 images)
  - Contact preferences
  
- ✅ Track Complaint Status
  - Visual timeline
  - Current status indicator
  - Assigned officer details
  - Expected resolution date
  
- ✅ Complaint History
  - List of all submitted complaints
  - Filter by status, date, category
  - Search functionality
  - Export to PDF

### Communication
- ✅ In-app messaging with officer
- ✅ Email notifications
- ✅ SMS alerts (optional)
- ✅ Push notifications

### Dashboard
- ✅ Overview statistics
- ✅ Recent complaints
- ✅ Quick actions
- ✅ Nearby issues map

## 4.2 Admin/Municipal Authority Features

### Complaint Management
- ✅ View All Complaints
  - Filter by: Status, Category, Location, Date Range, Priority
  - Sort by: Date, Priority, Status
  - Search by: ID, Title, Citizen Name
  
- ✅ Assign Complaints
  - Auto-assign based on category
  - Manual assignment to officers
  - Reassign to different officers
  - Bulk assignment

- ✅ Update Status
  - Pending → In Progress → Resolved → Closed
  - Add comments at each stage
  - Upload resolution photos
  - Set priority level

### Officer Management
- ✅ Add/Remove Officers
- ✅ View Officer Workload
- ✅ Performance Analytics
- ✅ Department Management

### Analytics Dashboard
- ✅ Complaint Statistics
  - Total complaints by status
  - Average resolution time
  - Complaints by category
  - Geographic heatmap
  
- ✅ Performance Metrics
  - Officer efficiency ratings
  - Department-wise performance
  - Citizen satisfaction scores
  - Monthly/Yearly trends

### Reports
- ✅ Generate PDF Reports
- ✅ Export to Excel
- ✅ Scheduled Reports
- ✅ Custom Date Range

## 4.3 System Admin Features

- ✅ User Management
- ✅ System Configuration
- ✅ Backup and Restore
- ✅ API Monitoring
- ✅ Log Analysis
- ✅ Role Management

---

# 5. DATABASE DESIGN (MongoDB Schema)

## 5.1 User Schema

```javascript
{
  _id: ObjectId,
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: false,
    maxlength: 15
  },
  role: {
    type: String,
    enum: ['citizen', 'officer', 'admin', 'superadmin'],
    default: 'citizen'
  },
  avatar: {
    type: String,
    default: null
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

## 5.2 Complaint Schema

```javascript
{
  _id: ObjectId,
  complaintId: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: [
      'pothole',
      'garbage',
      'water_leakage',
      'street_light',
      'electricity',
      'drainage',
      'road_damage',
      'illegal_construction',
      'noise_pollution',
      'other'
    ]
  },
  location: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    },
    landmark: String
  },
  images: [{
    url: String,
    publicId: String,
    uploadedAt: Date
  }],
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved', 'closed', 'rejected'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  reportedBy: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: ObjectId,
    ref: 'User',
    default: null
  },
  assignedAt: {
    type: Date,
    default: null
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  resolution: {
    notes: String,
    images: [{
      url: String,
      publicId: String
    }],
    resolvedBy: {
      type: ObjectId,
      ref: 'User'
    }
  },
  votes: {
    upvotes: {
      type: Number,
      default: 0
    },
    downvotes: {
      type: Number,
      default: 0
    }
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

## 5.3 Status Update Schema

```javascript
{
  _id: ObjectId,
  complaintId: {
    type: ObjectId,
    ref: 'Complaint',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved', 'closed', 'rejected'],
    required: true
  },
  comment: {
    type: String,
    maxlength: 1000
  },
  updatedBy: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    url: String,
    publicId: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

## 5.4 Category Schema

```javascript
{
  _id: ObjectId,
  name: {
    type: String,
    required: true,
    unique: true
  },
  label: {
    type: String,
    required: true
  },
  description: String,
  icon: String,
  color: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  estimatedResolutionDays: {
    type: Number,
    default: 7
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

## 5.5 Notification Schema

```javascript
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['status_update', 'assignment', 'reminder', 'system'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  complaintId: {
    type: ObjectId,
    ref: 'Complaint'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

---

# 6. UI/UX DESIGN

## 6.1 Design System

### Color Palette
```css
:root {
  /* Primary Colors */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;  /* Main Primary */
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;

  /* Status Colors */
  --status-pending: #f59e0b;
  --status-in-progress: #3b82f6;
  --status-resolved: #10b981;
  --status-closed: #6b7280;
  --status-rejected: #ef4444;

  /* Priority Colors */
  --priority-low: #22c55e;
  --priority-medium: #f59e0b;
  --priority-high: #f97316;
  --priority-urgent: #dc2626;

  /* Neutral Colors */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;

  /* Semantic Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}
```

### Typography
```css
:root {
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  
  /* Font Sizes */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### Spacing System
```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
}
```

## 6.2 Page Designs

### Home Page Layout
```
┌─────────────────────────────────────────────────────────────┐
│  NAVBAR                                                     │
│  [Logo]  Home  About  How It Works  Contact    [Login]      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  HERO SECTION                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Report Civic Issues.                               │   │
│  │  Get Them Resolved.                                 │   │
│  │  Make Your City Better.                             │   │
│  │                                                     │   │
│  │  [Report an Issue]        [Track Complaint]         │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  STATS SECTION                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ 10,000+     │  │ 8,500+      │  │ 4.5/5       │         │
│  │ Complaints  │  │ Resolved    │  │ Rating      │         │
│  │ Reported    │  │ Issues      │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  HOW IT WORKS                                               │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │   📸     │───▶│   📝     │───▶│   ✅     │              │
│  │ Report   │    │ Track    │    │ Resolved │              │
│  │ Issue    │    │ Progress │    │          │              │
│  └──────────┘    └──────────┘    └──────────┘              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ISSUE CATEGORIES                                           │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │
│  │ 🕳️     │ │ 🗑️     │ │ 💧     │ │ 💡     │ │ ⚡     │    │
│  │Pothole │ │Garbage │ │ Water  │ │ Street │ │Electric│    │
│  │        │ │        │ │ Leak   │ │ Light  │ │        │    │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  FOOTER                                                     │
│  [Links]  [Social]  [Contact]                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Login Page Layout
```
┌─────────────────────────────────────────────────────────────┐
│  NAVBAR                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Welcome Back!                                      │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ 📧 Email                                    │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ 🔒 Password                                 │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  [✓ Remember me]        Forgot Password?           │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │           [    Sign In    ]                 │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  ──────────────── or ────────────────              │   │
│  │                                                     │   │
│  │  [Continue with Google]                            │   │
│  │                                                     │   │
│  │  Don't have an account? [Sign Up]                  │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Citizen Dashboard Layout
```
┌─────────────────────────────────────────────────────────────┐
│  NAVBAR                                          [👤 User ▼]│
├─────────────────────────────────────────────────────────────┤
│  SIDEBAR        │  MAIN CONTENT AREA                        │
│                 │                                           │
│  [📊 Dashboard] │  ┌─────────────────────────────────────┐ │
│  [📝 Report]    │  │ Welcome, John!                      │ │
│  [📋 My Issues] │  │                                     │ │
│  [🔔 Notifs]    │  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │ │
│  [⚙️ Settings]  │  │  │Total│ │Open │ │Resol│ │Close│  │ │
│                 │  │  │  12 │ │  3  │ │  8  │ │  1  │  │ │
│                 │  │  └─────┘ └─────┘ └─────┘ └─────┘  │ │
│                 │  └─────────────────────────────────────┘ │
│                 │                                           │
│                 │  ┌─────────────────────────────────────┐ │
│                 │  │ Recent Complaints                   │ │
│                 │  │                                     │ │
│                 │  │ ┌─────────────────────────────────┐ │ │
│                 │  │ │ 🕳️ Pothole on Main St           │ │ │
│                 │  │ │ Status: In Progress    [View]   │ │ │
│                 │  │ └─────────────────────────────────┘ │ │
│                 │  │ ┌─────────────────────────────────┐ │ │
│                 │  │ │ 💡 Street Light Not Working     │ │ │
│                 │  │ │ Status: Pending        [View]   │ │ │
│                 │  │ └─────────────────────────────────┘ │ │
│                 │  └─────────────────────────────────────┘ │
│                 │                                           │
└─────────────────┴───────────────────────────────────────────┘
```

### Complaint Form Layout
```
┌─────────────────────────────────────────────────────────────┐
│  NAVBAR                                          [👤 User ▼]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Report a New Issue                                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Issue Title *                                      │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ Enter a brief title                         │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  Category *                                         │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ ▼ Select category                           │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  Description *                                      │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ Describe the issue in detail...             │   │   │
│  │  │                                             │   │   │
│  │  │                                             │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  Location *                                         │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ 📍 Pick location on map                     │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │  [🗺️ Interactive Map Component]                    │   │
│  │                                                     │   │
│  │  Upload Images                                      │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ 📷 [Drag & Drop or Click to Upload]         │   │   │
│  │  │     Max 5 images, 5MB each                  │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │         [  Submit Complaint  ]              │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Admin Panel Layout
```
┌─────────────────────────────────────────────────────────────┐
│  ADMIN NAVBAR                                    [👤 Admin ▼]│
├─────────────────────────────────────────────────────────────┤
│  SIDEBAR        │  MAIN CONTENT AREA                        │
│                 │                                           │
│  [📊 Dashboard] │  ┌─────────────────────────────────────┐ │
│  [📋 Complaints]│  │ All Complaints                      │ │
│  [👥 Officers]  │  │                                     │ │
│  [📈 Reports]   │  │ [🔍 Search...] [Filter ▼] [Export]  │ │
│  [⚙️ Settings]  │  │                                     │ │
│                 │  │ ┌─────────────────────────────────┐ │ │
│                 │  │ │ ID    Title    Status  Assign  │ │ │
│                 │  │ │ ────────────────────────────── │ │ │
│                 │  │ │ #1001 Pothole  Pending [Assign]│ │ │
│                 │  │ │ #1002 Light    In Prog [View]  │ │ │
│                 │  │ │ #1003 Garbage  Resolved[View]  │ │ │
│                 │  │ └─────────────────────────────────┘ │ │
│                 │  │                                     │ │
│                 │  │ [< Prev] Page 1 of 10 [Next >]      │ │
│                 │  └─────────────────────────────────────┘ │
│                 │                                           │
└─────────────────┴───────────────────────────────────────────┘
```

---

# 7. API DESIGN

## 7.1 Authentication APIs

### POST /api/auth/register
**Description**: Register a new citizen account

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "citizen"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (400 Bad Request)**:
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    { "field": "email", "message": "Email already exists" }
  ]
}
```

### POST /api/auth/login
**Description**: Login existing user

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "citizen",
      "avatar": "https://..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /api/auth/logout
**Description**: Logout user (invalidate token)

**Headers**:
```
Authorization: Bearer <token>
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### GET /api/auth/me
**Description**: Get current user profile

**Headers**:
```
Authorization: Bearer <token>
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "citizen",
    "avatar": "https://...",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

## 7.2 Complaint APIs

### POST /api/complaints
**Description**: Submit a new complaint

**Headers**:
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body**:
```
title: "Large Pothole on Main Street"
description: "There is a dangerous pothole..."
category: "pothole"
location[address]: "123 Main St, City"
location[coordinates][lat]: 40.7128
location[coordinates][lng]: -74.0060
images: [File, File, File]
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Complaint submitted successfully",
  "data": {
    "complaintId": "CMP-2024-001234",
    "title": "Large Pothole on Main Street",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### GET /api/complaints
**Description**: Get all complaints (with filters)

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
```
?status=pending&category=pothole&page=1&limit=10&sortBy=createdAt&order=desc
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "complaints": [
      {
        "id": "507f1f77bcf86cd799439011",
        "complaintId": "CMP-2024-001234",
        "title": "Large Pothole on Main Street",
        "category": "pothole",
        "status": "pending",
        "priority": "high",
        "location": {
          "address": "123 Main St, City",
          "coordinates": { "lat": 40.7128, "lng": -74.0060 }
        },
        "images": ["https://..."],
        "createdAt": "2024-01-15T10:30:00Z",
        "reportedBy": {
          "id": "507f1f77bcf86cd799439011",
          "name": "John Doe"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5
    }
  }
}
```

### GET /api/complaints/:id
**Description**: Get single complaint details

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "complaintId": "CMP-2024-001234",
    "title": "Large Pothole on Main Street",
    "description": "There is a dangerous pothole...",
    "category": "pothole",
    "status": "in_progress",
    "priority": "high",
    "location": {
      "address": "123 Main St, City",
      "coordinates": { "lat": 40.7128, "lng": -74.0060 },
      "landmark": "Near City Hall"
    },
    "images": ["https://...", "https://..."],
    "reportedBy": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "assignedTo": {
      "id": "507f1f77bcf86cd799439012",
      "name": "Officer Smith",
      "department": "Road Maintenance"
    },
    "statusHistory": [
      {
        "status": "pending",
        "comment": "Complaint received",
        "updatedBy": "System",
        "updatedAt": "2024-01-15T10:30:00Z"
      },
      {
        "status": "in_progress",
        "comment": "Team dispatched",
        "updatedBy": "Officer Smith",
        "updatedAt": "2024-01-15T14:20:00Z"
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T14:20:00Z"
  }
}
```

### PUT /api/complaints/:id/status
**Description**: Update complaint status (Admin/Officer only)

**Request Body**:
```json
{
  "status": "in_progress",
  "comment": "Maintenance team dispatched to location",
  "priority": "high"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Status updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "status": "in_progress",
    "updatedAt": "2024-01-15T14:20:00Z"
  }
}
```

### POST /api/complaints/:id/assign
**Description**: Assign complaint to officer (Admin only)

**Request Body**:
```json
{
  "officerId": "507f1f77bcf86cd799439012"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Complaint assigned successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "assignedTo": {
      "id": "507f1f77bcf86cd799439012",
      "name": "Officer Smith"
    },
    "assignedAt": "2024-01-15T12:00:00Z"
  }
}
```

### DELETE /api/complaints/:id
**Description**: Delete complaint (Admin only)

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Complaint deleted successfully"
}
```

## 7.3 User APIs

### GET /api/users
**Description**: Get all users (Admin only)

**Query Parameters**:
```
?role=citizen&isActive=true&page=1&limit=20
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "citizen",
        "isActive": true,
        "complaintCount": 5,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150
    }
  }
}
```

### PUT /api/users/:id
**Description**: Update user profile

**Request Body**:
```json
{
  "name": "John Updated",
  "phone": "+1987654321",
  "address": {
    "street": "456 New St",
    "city": "New City",
    "state": "NY",
    "zipCode": "10001"
  }
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Updated",
    "phone": "+1987654321"
  }
}
```

## 7.4 Dashboard/Analytics APIs

### GET /api/dashboard/stats
**Description**: Get dashboard statistics

**Headers**:
```
Authorization: Bearer <token>
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalComplaints": 1250,
      "pending": 150,
      "inProgress": 280,
      "resolved": 750,
      "closed": 70
    },
    "byCategory": [
      { "category": "pothole", "count": 320 },
      { "category": "garbage", "count": 280 },
      { "category": "street_light", "count": 190 }
    ],
    "byPriority": [
      { "priority": "urgent", "count": 45 },
      { "priority": "high", "count": 180 },
      { "priority": "medium", "count": 650 },
      { "priority": "low", "count": 375 }
    ],
    "avgResolutionTime": 4.5,
    "satisfactionRate": 4.2,
    "monthlyTrend": [
      { "month": "Jan", "complaints": 120, "resolved": 95 },
      { "month": "Feb", "complaints": 150, "resolved": 130 }
    ]
  }
}
```

### GET /api/dashboard/map-data
**Description**: Get complaints for map visualization

**Query Parameters**:
```
?status=all&category=all&bounds=north,east,south,west
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "complaints": [
      {
        "id": "507f1f77bcf86cd799439011",
        "complaintId": "CMP-2024-001234",
        "title": "Pothole",
        "category": "pothole",
        "status": "pending",
        "coordinates": { "lat": 40.7128, "lng": -74.0060 }
      }
    ]
  }
}
```

---

# 8. COMPLETE DEVELOPMENT PROCESS

## Step 1: Project Setup

### 1.1 Initialize Frontend
```bash
# Create React app with Vite
npm create vite@latest civic-resolve-frontend -- --template react-ts

# Install dependencies
cd civic-resolve-frontend
npm install

# Install additional packages
npm install react-router-dom axios react-query zustand recharts
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install shadcn/ui components
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input form select
```

### 1.2 Initialize Backend
```bash
# Create backend directory
mkdir civic-resolve-backend
cd civic-resolve-backend
npm init -y

# Install dependencies
npm install express mongoose cors dotenv bcryptjs jsonwebtoken multer
npm install -D nodemon

# Create folder structure
mkdir -p models routes controllers middleware config utils
```

## Step 2: Database Setup

### 2.1 MongoDB Connection
```javascript
// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 2.2 Create Models
- User Model
- Complaint Model
- StatusUpdate Model
- Category Model
- Notification Model

## Step 3: Authentication Implementation

### 3.1 JWT Middleware
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized' });
    }
  }
  
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
```

### 3.2 Auth Controller
- register
- login
- logout
- getMe

## Step 4: Complaint System Implementation

### 4.1 Complaint Controller
- createComplaint
- getComplaints
- getComplaintById
- updateStatus
- assignComplaint
- deleteComplaint

### 4.2 Image Upload
```javascript
// middleware/upload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'civic-resolve',
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});

const upload = multer({ storage: storage });
```

## Step 5: Frontend Implementation

### 5.1 Setup Routing
```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ComplaintForm from './pages/ComplaintForm';
import ComplaintDetail from './pages/ComplaintDetail';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<ComplaintForm />} />
        <Route path="/complaint/:id" element={<ComplaintDetail />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 5.2 Create Pages
- Home Page
- Login/Register Pages
- Citizen Dashboard
- Complaint Form
- Complaint Tracking
- Admin Panel

### 5.3 Create Components
- Navbar
- Footer
- ComplaintCard
- StatusBadge
- MapComponent
- ImageUpload
- StatsCard
- Sidebar

## Step 6: Integration

### 6.1 API Service
```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### 6.2 State Management
```typescript
// store/authStore.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  }
}));
```

## Step 7: Testing

### 7.1 Unit Tests
```bash
# Frontend tests
npm run test

# Backend tests
npm run test
```

### 7.2 Integration Tests
- Test API endpoints
- Test authentication flow
- Test complaint submission
- Test file uploads

## Step 8: Deployment

### 8.1 Backend Deployment (Render)
1. Create account on Render
2. Create new Web Service
3. Connect GitHub repository
4. Set environment variables
5. Deploy

### 8.2 Frontend Deployment (Vercel/Netlify)
1. Build the project
```bash
npm run build
```
2. Deploy to Vercel/Netlify
3. Set environment variables

---

# 9. ADVANCED FEATURES

## 9.1 Live Location with Google Maps

### Implementation
```tsx
// components/MapPicker.tsx
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const MapPicker = ({ onLocationSelect }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [marker, setMarker] = useState(null);

  const handleMapClick = (e) => {
    const location = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    setMarker(location);
    onLocationSelect(location);
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      zoom={12}
      center={{ lat: 40.7128, lng: -74.0060 }}
      mapContainerClassName="map-container"
      onClick={handleMapClick}
    >
      {marker && <Marker position={marker} />}
    </GoogleMap>
  );
};
```

## 9.2 AI Issue Detection

### Implementation using TensorFlow.js
```javascript
// utils/aiDetection.js
import * as tf from '@tensorflow/tfjs';

const detectIssue = async (imageUrl) => {
  const model = await tf.loadLayersModel('/models/issue-detection.json');
  const image = await loadImage(imageUrl);
  const prediction = model.predict(image);
  
  const categories = ['pothole', 'garbage', 'water_leak', 'street_light'];
  const confidence = prediction.dataSync();
  
  return {
    category: categories[confidence.indexOf(Math.max(...confidence))],
    confidence: Math.max(...confidence)
  };
};
```

## 9.3 Real-time Notifications

### Implementation using Socket.io
```javascript
// server.js
const io = require('socket.io')(server, {
  cors: { origin: process.env.FRONTEND_URL }
});

io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(userId);
  });
});

// Emit notification
const notifyUser = (userId, notification) => {
  io.to(userId).emit('notification', notification);
};
```

## 9.4 Complaint Priority System

### Priority Algorithm
```javascript
const calculatePriority = (complaint) => {
  let score = 0;
  
  // Category-based scoring
  const categoryWeights = {
    'water_leakage': 10,
    'electricity': 9,
    'drainage': 8,
    'pothole': 6,
    'street_light': 5,
    'garbage': 4
  };
  
  score += categoryWeights[complaint.category] || 3;
  
  // Location density scoring
  const nearbyComplaints = countNearbyComplaints(complaint.location);
  score += Math.min(nearbyComplaints * 2, 10);
  
  // Age scoring
  const daysOpen = (Date.now() - complaint.createdAt) / (1000 * 60 * 60 * 24);
  score += Math.min(daysOpen, 5);
  
  // Determine priority
  if (score >= 20) return 'urgent';
  if (score >= 15) return 'high';
  if (score >= 10) return 'medium';
  return 'low';
};
```

---

# 10. PROJECT OUTPUT

## 10.1 Final Deliverables

### Web Application
- ✅ Fully functional React frontend
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Modern UI with Tailwind CSS
- ✅ Interactive components with shadcn/ui

### Backend API
- ✅ RESTful API with Node.js + Express
- ✅ JWT authentication
- ✅ Image upload to Cloudinary
- ✅ Input validation and error handling

### Database
- ✅ MongoDB with proper schema design
- ✅ Indexed queries for performance
- ✅ Data relationships and references

### Features Implemented
- ✅ User registration and login
- ✅ Complaint submission with images
- ✅ Real-time status tracking
- ✅ Admin panel for complaint management
- ✅ Officer assignment system
- ✅ Dashboard with analytics
- ✅ Map integration for location
- ✅ Notification system

## 10.2 User Workflows

### Citizen Workflow
1. Register/Login → Dashboard
2. Click "Report Issue" → Fill Form → Submit
3. Receive Complaint ID
4. Track status in real-time
5. Get notifications on updates
6. Provide feedback on resolution

### Admin Workflow
1. Login → Admin Dashboard
2. View all complaints
3. Filter by status/category
4. Assign to officers
5. Update status with comments
6. Generate reports

---

# 11. FUTURE SCOPE

## 11.1 Mobile Application
- Flutter/React Native app
- Offline complaint submission
- Push notifications
- Camera integration
- GPS auto-capture

## 11.2 AI Enhancements
- Automatic issue classification from images
- Predictive maintenance alerts
- Sentiment analysis from descriptions
- Chatbot for common queries
- Duplicate complaint detection

## 11.3 Government Integration
- Direct API integration with municipal systems
- Single Sign-On with government portals
- Automatic routing to relevant departments
- Budget allocation tracking
- Public works integration

## 11.4 Community Features
- Upvoting system for issues
- Community discussion threads
- Volunteer coordination
- Neighborhood watch integration
- Public forums

## 11.5 Advanced Analytics
- Heat maps of problem areas
- Seasonal trend analysis
- Resource optimization algorithms
- Citizen satisfaction surveys
- Performance benchmarking

---

# 12. SOURCE CODE STRUCTURE

## 12.1 Project Structure

```
civic-resolve/
├── frontend/                          # React Frontend
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── assets/
│   ├── src/
│   │   ├── components/               # Reusable Components
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ComplaintCard.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── MapPicker.tsx
│   │   │   ├── ImageUpload.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── NotificationBell.tsx
│   │   ├── pages/                    # Page Components
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ComplaintForm.tsx
│   │   │   ├── ComplaintDetail.tsx
│   │   │   ├── ComplaintList.tsx
│   │   │   ├── AdminPanel.tsx
│   │   │   ├── OfficerDashboard.tsx
│   │   │   └── Profile.tsx
│   │   ├── hooks/                    # Custom Hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useComplaints.ts
│   │   │   └── useNotifications.ts
│   │   ├── store/                    # State Management
│   │   │   ├── authStore.ts
│   │   │   ├── complaintStore.ts
│   │   │   └── notificationStore.ts
│   │   ├── services/                 # API Services
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── complaintService.ts
│   │   │   └── userService.ts
│   │   ├── types/                    # TypeScript Types
│   │   │   ├── user.ts
│   │   │   ├── complaint.ts
│   │   │   └── index.ts
│   │   ├── utils/                    # Utilities
│   │   │   ├── constants.ts
│   │   │   ├── helpers.ts
│   │   │   └── formatters.ts
│   │   ├── styles/                   # Global Styles
│   │   │   └── globals.css
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env
│
├── backend/                           # Node.js Backend
│   ├── config/                        # Configuration
│   │   ├── db.js                      # Database connection
│   │   ├── cloudinary.js              # Cloudinary config
│   │   └── email.js                   # Email service config
│   ├── controllers/                   # Route Controllers
│   │   ├── authController.js
│   │   ├── complaintController.js
│   │   ├── userController.js
│   │   ├── dashboardController.js
│   │   └── notificationController.js
│   ├── middleware/                    # Custom Middleware
│   │   ├── auth.js                    # JWT verification
│   │   ├── errorHandler.js
│   │   ├── upload.js                  # File upload
│   │   └── validator.js
│   ├── models/                        # MongoDB Models
│   │   ├── User.js
│   │   ├── Complaint.js
│   │   ├── StatusUpdate.js
│   │   ├── Category.js
│   │   └── Notification.js
│   ├── routes/                        # API Routes
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── userRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── index.js
│   ├── utils/                         # Utilities
│   │   ├── generateToken.js
│   │   ├── generateComplaintId.js
│   │   ├── emailTemplates.js
│   │   └── helpers.js
│   ├── server.js                      # Entry point
│   ├── package.json
│   └── .env
│
├── docs/                              # Documentation
│   ├── PROJECT_DOCUMENTATION.md
│   ├── API_DOCUMENTATION.md
│   └── DEPLOYMENT_GUIDE.md
│
├── uploads/                           # Temporary uploads
│
├── .gitignore
├── README.md
└── package.json
```

## 12.2 Key Files Description

### Frontend Key Files
| File | Description |
|------|-------------|
| `App.tsx` | Main application component with routing |
| `main.tsx` | Application entry point |
| `api.ts` | Axios configuration for API calls |
| `authStore.ts` | Zustand store for authentication state |
| `Navbar.tsx` | Navigation component |
| `ComplaintCard.tsx` | Complaint display card |
| `MapPicker.tsx` | Google Maps location picker |
| `Dashboard.tsx` | Citizen dashboard page |
| `AdminPanel.tsx` | Admin management interface |

### Backend Key Files
| File | Description |
|------|-------------|
| `server.js` | Express server configuration |
| `db.js` | MongoDB connection setup |
| `authController.js` | Authentication logic |
| `complaintController.js` | Complaint CRUD operations |
| `User.js` | User Mongoose model |
| `Complaint.js` | Complaint Mongoose model |
| `auth.js` | JWT middleware |
| `upload.js` | Multer + Cloudinary configuration |

---

# APPENDIX

## A. Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/civic-resolve
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## B. NPM Scripts

### Frontend
```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
}
```

### Backend
```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "jest"
}
```

## C. Useful Resources

- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Author**: Civic Resolve Development Team
