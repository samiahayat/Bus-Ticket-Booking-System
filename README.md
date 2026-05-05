# 🚌 Bus Ticket Booking System

A full-stack web application for booking bus tickets online with real-time seat availability, secure payment processing, and comprehensive admin management.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![.NET Version](https://img.shields.io/badge/.NET-6.0-purple.svg)
![React Version](https://img.shields.io/badge/React-18.0-blue.svg)
![SQL Server](https://img.shields.io/badge/SQL%20Server-2019-red.svg)

## ✨ Features

### 👤 User Features
- **User Authentication** - Secure registration and login with JWT tokens
- **Search Buses** - Search between cities with date selection
- **Interactive Seat Selection** - Visual seat layout with real-time availability
- **Secure Payments** - Stripe payment gateway integration
- **Booking Management** - View booking history and cancel reservations
- **E-Tickets** - Download tickets as PDF
- **Email Notifications** - Automatic confirmation emails

### 👨‍💼 Admin Features
- **Admin Dashboard** - Complete analytics and statistics
- **Bus Management** - Add, edit, delete bus details
- **Route Management** - Manage city routes and fares
- **Schedule Management** - Create and update bus schedules
- **Booking Overview** - View all user bookings
- **Revenue Tracking** - Monitor payments and earnings

### 🚀 Advanced Features
- Real-time seat availability updates
- Responsive mobile-friendly design
- Promo code/discount system
- Booking cancellation with refund
- Email/SMS notifications
- PDF ticket generation

## 🛠️ Tech Stack

### Backend
- **Framework**: ASP.NET Core 6.0 Web API
- **Database**: SQL Server with Entity Framework Core
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Stripe API
- **Architecture**: Repository Pattern & DTOs
- **Security**: BCrypt for password hashing

### Frontend
- **Library**: React 18
- **State Management**: React Context API
- **Routing**: React Router DOM v6
- **UI Framework**: React Bootstrap & Material-UI
- **HTTP Client**: Axios
- **Payment**: Stripe.js & React Stripe.js

### Tools & Deployment
- **Version Control**: Git & GitHub
- **IDE**: Visual Studio 2022 / VS Code
- **API Testing**: Postman
- **Deployment**: Azure (Backend) + Netlify (Frontend)

## 📋 Prerequisites

Before you begin, ensure you have installed:

- [.NET 6.0 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v14 or higher)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (or SQL Server Express)
- [Git](https://git-scm.com/)
- [Stripe Account](https://stripe.com/) (for payments)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bus-booking-system.git
cd bus-booking-system
