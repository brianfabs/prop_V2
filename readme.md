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


## Data Structure

### Enhanced Roofing Options Collection
```javascript
{
  type: "good" | "better" | "best",
  title: "Option Title",
  description: "Detailed description",
  warranty: "Warranty information",
  image: "Image URL",
  pricePerSquare: 625.00,        // Standard pricing (≥16 squares)
  pricePerSquareUnder16: 725.00  // Higher pricing (<16 squares)
}
```

### Proposals Collection
```javascript
{
  customerName: "Customer Name",
  address: "Property Address", 
  squares: 25.5,
  createdBy: "user@company.com",
  createdAt: timestamp,
  updatedAt: timestamp,
  updatedBy: "user@company.com"
}
```

### Loan Options Collection
```javascript
{
  name: "Financing Option Name",
  years: 15,    // Term length in years
  rate: 6.99    // Annual percentage rate
}
```

## Application Structure

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

The app requires a `firebase-config.js` file with your Firebase credentials:

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

