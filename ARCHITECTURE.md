# System Architecture & Design Diagrams

This document contains comprehensive system design diagrams for the Auto Hub Dealership platform.

## 📐 System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        Mobile[Mobile Browser]
    end

    subgraph "Frontend Application"
        React[React 18 + TypeScript]
        Router[React Router]
        Context[Context API]
        UI[Tailwind CSS UI]
    end

    subgraph "Backend Services - Supabase"
        Auth[Authentication Service]
        DB[(PostgreSQL Database)]
        Storage[File Storage]
        Realtime[Realtime Subscriptions]
        RLS[Row Level Security]
    end

    subgraph "Database Tables"
        Profiles[profiles]
        Vehicles[vehicles]
        Bookings[bookings]
        Customers[customers]
        Services[services]
        Content[content_sections]
        Notifications[notifications]
        Settings[business_settings]
    end

    subgraph "External Services"
        Netlify[Netlify Hosting]
        GitHub[GitHub Repository]
    end

    Browser --> React
    Mobile --> React
    React --> Router
    Router --> Context
    Context --> Auth
    Context --> DB
    React --> UI

    Auth --> Profiles
    DB --> Vehicles
    DB --> Bookings
    DB --> Customers
    DB --> Services
    DB --> Content
    DB --> Notifications
    DB --> Settings

    DB --> RLS
    DB --> Realtime
    Storage --> Vehicles

    React --> Netlify
    Netlify --> GitHub

    style React fill:#61dafb
    style DB fill:#336791
    style Auth fill:#3ecf8e
    style Netlify fill:#00ad9f
```

## 🗄️ Database Schema Diagram (ERD)

```mermaid
erDiagram
    profiles ||--o{ customers : "has"
    profiles ||--o{ notifications : "receives"
    customers ||--o{ bookings : "makes"
    services ||--o{ bookings : "booked_for"
    bookings }o--|| customers : "belongs_to"

    profiles {
        uuid id PK
        text email UK
        text full_name
        text phone
        enum role
        text avatar_url
        timestamptz created_at
        timestamptz updated_at
    }

    vehicles {
        uuid id PK
        text make
        text model
        integer year
        integer price
        integer mileage
        text vin UK
        enum status
        text_array images
        jsonb specs
        text_array features
        text_array tags
        text description
        timestamptz created_at
        timestamptz updated_at
    }

    customers {
        uuid id PK
        uuid profile_id FK
        text full_name
        text email
        text phone
        text address
        text_array vehicles
        integer total_spent
        timestamptz last_service_date
        text status
        text notes
        timestamptz created_at
        timestamptz updated_at
    }

    bookings {
        uuid id PK
        uuid customer_id FK
        uuid service_id FK
        text customer_name
        text customer_email
        text customer_phone
        text service
        text vehicle
        date booking_date
        time booking_time
        enum status
        text notes
        integer estimated_cost
        integer actual_cost
        text assigned_technician
        timestamptz created_at
        timestamptz updated_at
    }

    services {
        uuid id PK
        text name
        text description
        integer price_from
        integer duration_minutes
        text category
        boolean is_active
        timestamptz created_at
    }

    content_sections {
        uuid id PK
        enum section_type UK
        text title
        boolean visible
        integer sort_order
        jsonb content
        timestamptz created_at
        timestamptz updated_at
    }

    notifications {
        uuid id PK
        uuid user_id FK
        text title
        text message
        text type
        boolean is_read
        jsonb data
        timestamptz created_at
    }

    business_settings {
        uuid id PK
        text key UK
        jsonb value
        timestamptz updated_at
    }
```

## 🧩 Component Architecture Diagram

```mermaid
graph TD
    subgraph "App.tsx - Root Component"
        Router[React Router]
        ErrorBoundary[Error Boundary]
    end

    subgraph "Context Providers"
        AuthProvider[AuthContext]
        VehicleProvider[VehicleContext]
        BookingProvider[BookingContext]
        ContentProvider[ContentContext]
    end

    subgraph "Layout Components"
        Header[Header]
        Footer[Footer]
    end

    subgraph "Page Components"
        HomePage[HomePage]
        InventoryPage[InventoryPage]
        ServicesPage[ServicesPage]
        BookingPage[BookingPage]
        VehicleDetailPage[VehicleDetailPage]
        AdminPage[AdminPage]
        ContactPage[ContactPage]
        RepairStatusPage[RepairStatusPage]
    end

    subgraph "Home Page Components"
        HeroSection[HeroSection]
        QuickActions[QuickActions]
        NewArrivals[NewArrivals]
        ServicesPreview[ServicesPreview]
        FinanceSection[FinanceSection]
        TrustSection[TrustSection]
        PromoSection[PromoSection]
        MapSection[MapSection]
        RepairStatusWidget[RepairStatusWidget]
    end

    subgraph "Admin Components"
        AdminDashboard[AdminDashboard]
        InventoryManager[InventoryManager]
        BookingManager[BookingManager]
        CustomerManager[CustomerManager]
        ContentManager[ContentManager]
        AnalyticsDashboard[AnalyticsDashboard]
        SystemSettings[SystemSettings]
    end

    subgraph "UI Components"
        VehicleCard[VehicleCard]
        Modal[Modal]
        Toast[Toast]
        LoadingSpinner[LoadingSpinner]
        Car3D[Car3D]
        FormValidation[FormValidation]
    end

    subgraph "Auth Components"
        AdminLogin[AdminLogin]
        ProtectedRoute[ProtectedRoute]
    end

    Router --> HomePage
    Router --> InventoryPage
    Router --> ServicesPage
    Router --> BookingPage
    Router --> VehicleDetailPage
    Router --> AdminPage
    Router --> ContactPage
    Router --> RepairStatusPage

    HomePage --> HeroSection
    HomePage --> QuickActions
    HomePage --> NewArrivals
    HomePage --> ServicesPreview
    HomePage --> FinanceSection
    HomePage --> TrustSection
    HomePage --> PromoSection
    HomePage --> MapSection
    HomePage --> RepairStatusWidget

    AdminPage --> AdminDashboard
    AdminPage --> InventoryManager
    AdminPage --> BookingManager
    AdminPage --> CustomerManager
    AdminPage --> ContentManager
    AdminPage --> AnalyticsDashboard
    AdminPage --> SystemSettings
    AdminPage --> ProtectedRoute
    ProtectedRoute --> AdminLogin

    InventoryPage --> VehicleCard
    VehicleDetailPage --> VehicleCard
    VehicleDetailPage --> Car3D

    AuthProvider --> AdminPage
    VehicleProvider --> InventoryPage
    BookingProvider --> BookingPage
    ContentProvider --> HomePage

    style HomePage fill:#61dafb
    style AdminPage fill:#f39c12
    style AuthProvider fill:#3ecf8e
```

## 🔄 User Flow Diagram

```mermaid
flowchart TD
    Start([User Visits Website]) --> HomePage[Home Page]

    HomePage --> BrowseInventory{Browse Inventory?}
    HomePage --> BookService{Book Service?}
    HomePage --> ViewServices{View Services?}
    HomePage --> AdminLogin{Admin Login?}

    BrowseInventory --> InventoryPage[Inventory Page]
    InventoryPage --> FilterVehicles[Filter/Search Vehicles]
    FilterVehicles --> VehicleDetail[Vehicle Detail Page]
    VehicleDetail --> BookService

    ViewServices --> ServicesPage[Services Page]
    ServicesPage --> BookService

    BookService --> BookingPage[Booking Page]
    BookingPage --> FillForm[Fill Booking Form]
    FillForm --> SubmitBooking[Submit Booking]
    SubmitBooking --> Confirmation[Booking Confirmation]

    AdminLogin --> AdminAuth[Admin Authentication]
    AdminAuth --> AdminDashboard{Valid Admin?}
    AdminDashboard -->|Yes| AdminPage[Admin Dashboard]
    AdminDashboard -->|No| AdminLogin

    AdminPage --> ManageInventory[Manage Inventory]
    AdminPage --> ManageBookings[Manage Bookings]
    AdminPage --> ManageCustomers[Manage Customers]
    AdminPage --> ManageContent[Manage Content]
    AdminPage --> ViewAnalytics[View Analytics]
    AdminPage --> SystemSettings[System Settings]

    ManageInventory --> AddVehicle[Add/Edit Vehicle]
    ManageBookings --> UpdateBooking[Update Booking Status]
    ManageCustomers --> ViewCustomer[View Customer Details]
    ManageContent --> EditSections[Edit Content Sections]

    style HomePage fill:#61dafb
    style AdminPage fill:#f39c12
    style BookingPage fill:#3ecf8e
    style Confirmation fill:#2ecc71
```

## 🔐 Authentication & Authorization Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Supabase Auth
    participant Database
    participant RLS

    User->>Frontend: Access Protected Route
    Frontend->>Supabase Auth: Check Session
    Supabase Auth-->>Frontend: Session Status

    alt No Session
        Frontend->>User: Redirect to Login
        User->>Frontend: Enter Credentials
        Frontend->>Supabase Auth: Sign In
        Supabase Auth->>Database: Verify User
        Database-->>Supabase Auth: User Data
        Supabase Auth-->>Frontend: Auth Token
        Frontend->>Frontend: Store Session
    end

    User->>Frontend: Request Data
    Frontend->>Database: Query with Token
    Database->>RLS: Check Policies
    RLS->>Database: Policy Result

    alt Authorized
        Database-->>Frontend: Data
        Frontend-->>User: Display Data
    else Unauthorized
        Database-->>Frontend: Error
        Frontend-->>User: Access Denied
    end
```

## 📊 Data Flow Diagram

```mermaid
flowchart LR
    subgraph "User Actions"
        View[View Vehicles]
        Book[Book Service]
        Admin[Admin Actions]
    end

    subgraph "React Context"
        VehicleCtx[VehicleContext]
        BookingCtx[BookingContext]
        ContentCtx[ContentContext]
        AuthCtx[AuthContext]
    end

    subgraph "Supabase Client"
        SupabaseClient[Supabase Client]
    end

    subgraph "Database Operations"
        Select[SELECT Queries]
        Insert[INSERT Queries]
        Update[UPDATE Queries]
        Delete[DELETE Queries]
    end

    subgraph "Real-time Updates"
        RealtimeSub[Realtime Subscriptions]
        Notifications[Push Notifications]
    end

    View --> VehicleCtx
    Book --> BookingCtx
    Admin --> AuthCtx

    VehicleCtx --> SupabaseClient
    BookingCtx --> SupabaseClient
    ContentCtx --> SupabaseClient
    AuthCtx --> SupabaseClient

    SupabaseClient --> Select
    SupabaseClient --> Insert
    SupabaseClient --> Update
    SupabaseClient --> Delete

    SupabaseClient --> RealtimeSub
    RealtimeSub --> Notifications
    Notifications --> VehicleCtx
    Notifications --> BookingCtx

    style VehicleCtx fill:#61dafb
    style BookingCtx fill:#3ecf8e
    style SupabaseClient fill:#336791
```

## 🛠️ Technology Stack Diagram

```mermaid
graph TB
    subgraph "Frontend Stack"
        React[React 18.3]
        TypeScript[TypeScript 5.5]
        Vite[Vite 5.4]
        Tailwind[Tailwind CSS 3.4]
        Router[React Router 7.8]
        Icons[Lucide React]
    end

    subgraph "Backend Stack"
        Supabase[Supabase]
        PostgreSQL[PostgreSQL]
        Auth[Supabase Auth]
        Storage[Supabase Storage]
        Realtime[Supabase Realtime]
    end

    subgraph "Development Tools"
        ESLint[ESLint]
        PostCSS[PostCSS]
        Autoprefixer[Autoprefixer]
    end

    subgraph "Deployment"
        Netlify[Netlify]
        GitHub[GitHub]
    end

    React --> TypeScript
    TypeScript --> Vite
    Vite --> Tailwind
    Tailwind --> PostCSS
    PostCSS --> Autoprefixer
    React --> Router
    React --> Icons

    Supabase --> PostgreSQL
    Supabase --> Auth
    Supabase --> Storage
    Supabase --> Realtime

    Vite --> ESLint

    React --> Netlify
    Netlify --> GitHub

    style React fill:#61dafb
    style TypeScript fill:#3178c6
    style Supabase fill:#3ecf8e
    style PostgreSQL fill:#336791
    style Netlify fill:#00ad9f
```

## 📱 Page Structure & Routing

```mermaid
graph LR
    App[App.tsx] --> Routes[Routes]

    Routes --> Home[/ - HomePage]
    Routes --> Inventory[/inventory - InventoryPage]
    Routes --> Services[/services - ServicesPage]
    Routes --> Vehicle[/vehicle/:id - VehicleDetailPage]
    Routes --> Book[/book - BookingPage]
    Routes --> Repair[/repair-status - RepairStatusPage]
    Routes --> Contact[/contact - ContactPage]
    Routes --> Admin[/admin - AdminPage]

    Home --> Hero[Hero Section]
    Home --> NewArrivals[New Arrivals]
    Home --> ServicesPreview[Services Preview]
    Home --> Finance[Finance Section]
    Home --> Trust[Trust Section]
    Home --> Promo[Promo Section]
    Home --> Map[Map Section]

    Inventory --> VehicleList[Vehicle List]
    Inventory --> Filters[Filters & Search]

    Vehicle --> Details[Vehicle Details]
    Vehicle --> Car3D[3D Car View]
    Vehicle --> Specs[Specifications]

    Admin --> Dashboard[Admin Dashboard]
    Admin --> InventoryMgr[Inventory Manager]
    Admin --> BookingMgr[Booking Manager]
    Admin --> CustomerMgr[Customer Manager]
    Admin --> ContentMgr[Content Manager]
    Admin --> Analytics[Analytics]
    Admin --> Settings[System Settings]

    style Home fill:#61dafb
    style Admin fill:#f39c12
    style Vehicle fill:#e74c3c
```

## 🔒 Security Architecture

```mermaid
graph TB
    subgraph "Client Security"
        HTTPS[HTTPS/SSL]
        TokenStorage[Secure Token Storage]
        InputValidation[Input Validation]
    end

    subgraph "Supabase Security"
        RLS[Row Level Security]
        Policies[RLS Policies]
        AuthPolicies[Auth Policies]
    end

    subgraph "Database Security"
        Constraints[Data Constraints]
        Triggers[Database Triggers]
        Indexes[Indexes for Performance]
    end

    subgraph "Access Control"
        RoleBased[Role-Based Access]
        CustomerRole[Customer Role]
        AdminRole[Admin Role]
        StaffRole[Staff Role]
    end

    HTTPS --> TokenStorage
    TokenStorage --> RLS
    InputValidation --> Policies

    RLS --> Policies
    Policies --> AuthPolicies
    AuthPolicies --> RoleBased

    RoleBased --> CustomerRole
    RoleBased --> AdminRole
    RoleBased --> StaffRole

    Policies --> Constraints
    Constraints --> Triggers
    Triggers --> Indexes

    style RLS fill:#e74c3c
    style RoleBased fill:#f39c12
    style HTTPS fill:#2ecc71
```

---

## 📝 Diagram Notes

### System Architecture

- **Frontend**: React SPA deployed on Netlify
- **Backend**: Supabase (BaaS) providing database, auth, storage, and realtime
- **Database**: PostgreSQL with Row Level Security
- **Deployment**: Continuous deployment via GitHub → Netlify

### Database Schema

- **8 main tables** with proper relationships
- **Foreign key constraints** for data integrity
- **Enums** for status fields (booking_status, vehicle_status, user_role)
- **JSONB fields** for flexible data storage (specs, content)
- **Array fields** for multi-value data (images, features, tags)

### Component Architecture

- **Context-based state management** (no Redux needed)
- **Protected routes** for admin access
- **Reusable UI components** for consistency
- **Error boundaries** for graceful error handling

### User Flows

- **Public users**: Browse inventory, view services, book appointments
- **Admin users**: Full CRUD operations on all entities
- **Real-time updates**: Live notifications and data sync

### Security

- **Row Level Security (RLS)** on all tables
- **Role-based access control** (customer, admin, staff)
- **Secure token management** via Supabase Auth
- **Input validation** on both client and server

---

_Last Updated: 2024_
