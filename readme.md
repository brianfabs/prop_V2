# Roofing Proposal App
Primary repository for professional roofing proposal application

## Overview
A comprehensive web-based sales proposal application for roofing companies to create, manage, and present professional pricing proposals to customers. The application serves both internal sales teams and provides customer-facing proposal views with integrated financing options.

## Features

### Core Functionality
- **User Authentication**: Simple localStorage-based authentication system
- **Proposal Management**: Create, edit, view, and manage customer proposals
- **3-Tier Pricing**: Good/Better/Best roofing options with configurable pricing
- **Loan Integration**: Integrated financing options with payment calculations
- **Admin Controls**: Content management and user administration
- **Responsive Design**: Mobile-friendly interface using modern CSS

### Pricing System
- **Dynamic Pricing**: Different rates for projects above/below 16 squares
- **Automatic Calculations**: Real-time price calculations based on project size
- **Financing Options**: Up to 3 configurable loan options with monthly payment calculations
- **Professional Display**: Customer-facing proposals with clean pricing presentation

### Admin Features
- **Content Management**: Manage roofing option details, pricing, and descriptions
- **Loan Options**: Configure financing terms, interest rates, and payment calculations
- **User Management**: Create and manage user accounts with role-based access
- **Debug Tools**: Toggle-able debug panel for troubleshooting
- **Live Preview**: Real-time preview of changes in admin interfaces

## Technology Stack


## Pricing Logic
The application implements dynamic pricing based on project size:
- **Standard Rate**: Projects ≥16 squares use `pricePerSquare`
- **Small Job Rate**: Projects <16 squares use `pricePerSquareUnder16` (higher rate)
- **Automatic Selection**: System automatically applies correct pricing tier

## Loan Calculations
Monthly payment calculation using standard amortization formula:
```
M = P[r(1+r)^n]/[(1+r)^n-1]
```
Where:
- M = Monthly payment
- P = Principal amount
- r = Monthly interest rate
- n = Total number of payments

## Firebase Configuration

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN", 
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
```

## File Structure
```
├── login.html / login.js           # Authentication
├── dashboard.html / dashboard.js   # Proposal management
├── create_proposal.html / create_proposal.js # Proposal creation
├── edit_proposal.html             # Proposal editing
├── proposal.html                  # Customer-facing proposal view
├── admin.html / admin.js          # Content management
├── loan_admin.html               # Loan options management
├── user-management.html / user-management.js # User administration
├── main.css                      # Design system
├── firebase-config.js            # Firebase configuration
└── README.md                     # Documentation
```

## Recent Updates

### Version 2.0 Features
- **Enhanced Pricing**: Added support for small job pricing (<16 squares)
- **Loan Integration**: Complete financing options with payment calculations
- **Navigation Standardization**: Reusable navigation component across pages
- **Admin Enhancements**: Loan options management and debug tools
- **Improved UX**: Streamlined customer-facing proposal display

### Security Considerations
- Simple authentication system (development/demo purposes)
- Admin role validation for content management
- Client-side form validation with server-side constraints
- Error handling and user feedback systems

## Development Status
Work in progress - Core features implemented with ongoing enhancements for production readiness.

## For AI/Developer Reference

This section provides additional details for AI or developers to understand the app's structure and data flow.

### App Structure
- The app is built using React with Vite, using functional components and hooks.
- All pages are located in `src/pages/` (e.g., `Login.tsx`, `Dashboard.tsx`, `ProposalView.tsx`).
- Routing is handled by React Router, with routes defined in `src/App.tsx`.
- Firebase Firestore is used for all data storage, with collections for `proposals`, `roofing_options`, `loan_options`, and `users`.

### Data Flow
- **Dashboard**: Fetches all proposals from Firestore and displays them in a table. The "View" button links to `/proposal/{id}` using the real Firestore document ID.
- **ProposalView**: Reads the proposal ID from the URL, fetches the proposal document, and displays customer/project info. It also fetches `roofing_options` and `loan_options` for dynamic pricing and options.
- **Firestore Timestamps** are converted to readable dates before rendering.
- All Firestore fetch logic is in `src/services/firebase.ts` or directly in the relevant page (e.g., Dashboard, ProposalView).

### Firestore Collections
- `proposals`: Stores each proposal (fields: `customerName`, `address`, `squares`, `createdAt`, etc.).
- `roofing_options`: Stores all available roofing options, pricing, and descriptions.
- `loan_options`: Stores all available financing options.
- `users`: Stores user accounts.

### Extending the App
- Add new pages to `src/pages/` and new routes in `src/App.tsx`.
- For new Firestore collections, add fetch logic in `src/services/firebase.ts`.
- Use Tailwind CSS for all new UI.

### Debugging Tips
- If you see a blank page, check the browser console for errors (often due to Firestore Timestamps or missing fields).
- Defensive checks are in place for missing or malformed data.
- If you add new fields to Firestore, update the relevant page/component to render them.

## Recent UI/UX Improvements (2024)

### Table Action Menu
- All row actions (View, Edit, Delete) are now consolidated into a single 3-dots (kebab) menu using the `TableActionsMenu` component.
- The dropdown menu is right-aligned with the button and appears exactly 4px below (or above, if not enough space) the button.
- The dropdown uses a React portal for correct z-index and overlays.
- The dropdown closes on outside click, Escape key, or navigation.
- The dropdown state is reset on route changes using React Router's `useLocation` to ensure the menu always works after navigating away and back.
- The dropdown menu is accessible and keyboard-navigable.

### Consistent Field Label Styling
- All input, select, and dropdown field labels use a consistent style: 12px font size and 70% text color opacity (`text-[12px] text-gray-900/70`).
- This applies to all forms, including login, create/edit proposal, create account, and proposal view pages.

### Other UI/UX Enhancements
- Improved dropdown positioning and alignment for a more professional look.
- Fixed issues with stale dropdown state after navigation.
- All changes are implemented using Tailwind CSS utility classes for consistency.