<div align="center">

# 🏥 MediLink Cloud

### An AI-Enabled Distributed Healthcare Appointment System

[![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)

<br/>

A full-stack, production-ready healthcare platform built with **microservices architecture** — featuring AI-powered symptom analysis, real-time video consultations, secure payments, and role-based dashboards for patients, doctors, and admins.

<br/>

[Getting Started](#-getting-started) · [Architecture](#-architecture) · [Features](#-features) · [Tech Stack](#-tech-stack) · [API Reference](#-api-reference)

</div>

---

## 📸 Overview

MediLink Cloud connects patients with verified healthcare professionals through an intelligent, distributed system. The platform leverages **Google Gemini AI** for symptom analysis, **Jitsi Meet** for video consultations, **Stripe** for secure payments, and **RabbitMQ** for asynchronous event-driven notifications.

> **10 microservices** · **3 role-based dashboards** · **1 unified API gateway**

---

## ✨ Features

### 🤖 AI-Powered Healthcare

- **AI Symptom Checker** — Analyze symptoms using Google Gemini AI and get intelligent health insights
- **AI Health Insights** — Personalized health recommendations based on patient data

### 👨‍⚕️ Doctor Management

- **Doctor Profiles** — Comprehensive profiles with specialization, experience, qualifications, and consultation fees
- **SLMC Verification** — Admin-verified credential system with certificate upload
- **Availability Scheduling** — Configurable working days, hours, time slots, buffer times, and blocked days
- **Clinical Notes** — Private note-taking for doctors
- **Prescription Builder** — Create and manage digital prescriptions with medicine details, dosage, and follow-up dates
- **Patient Reviews & Ratings** — Star ratings and comments after video consultations

### 🏥 Appointment System

- **Smart Booking** — Book appointments based on real-time doctor availability and time slots
- **Appointment Lifecycle** — Full flow from booking → payment → acceptance → completion
- **Doctor Controls** — Accept, reject, or complete appointments

### 💳 Payments

- **Stripe Checkout** — Secure redirect-based payment flow with multiple currency support (USD, EUR, GBP, INR, LKR)
- **Webhook Processing** — Real-time payment verification via Stripe webhooks with signature validation
- **Refund System** — Patient refund requests with reason tracking
- **Transaction Ledger** — Complete transaction history with fee calculations (2.9% + $0.30)
- **Admin Analytics** — Platform-wide revenue overview and payment statistics

### 📹 Telemedicine

- **Video Consultations** — Real-time video calls powered by Jitsi Meet
- **Session Management** — Track consultation status (scheduled → active → completed)
- **Clinical Notes** — Doctors can add notes during or after consultations

### 🔔 Notifications

- **Email Notifications** — Automated emails via Nodemailer for appointments, verifications, and consultations
- **Event-Driven Architecture** — RabbitMQ message queue for asynchronous notification delivery
- **In-App Notifications** — Real-time notification bell with read/unread status

### 👥 Role-Based Dashboards

- **Patient Dashboard** — Appointments, prescriptions, payments, reports, AI symptom checker, find doctors
- **Doctor Dashboard** — Schedule management, patient list, notes, reports, activity feed, research hub
- **Admin Dashboard** — User management, doctor verifications, appointment oversight, payment analytics

### 🔐 Security

- **JWT Authentication** — Centralized token verification at the API Gateway
- **Role-Based Access Control** — Granular permissions for patient, doctor, and admin roles
- **Stripe Webhook Signatures** — Cryptographic verification of payment events
- **Ownership Verification** — Users can only access their own data

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React SPA)                       │
│              Vite · TailwindCSS · Framer Motion                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY (:5001)                           │
│         Express · http-proxy-middleware · JWT Auth               │
│              Centralized routing & authentication                │
└──┬────┬────┬────┬────┬────┬────┬────┬───────────────────────────┘
   │    │    │    │    │    │    │    │
   ▼    ▼    ▼    ▼    ▼    ▼    ▼    ▼
┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐
│Auth ││Pati-││Doct-││Appo-││Pay- ││Noti-││Tele-││ AI  │
│Svc  ││ent  ││or   ││int- ││ment ││fica-││med  ││Symp-│
│:5000││Svc  ││Svc  ││ment ││Svc  ││tion ││Svc  ││tom  │
│     ││:3001││:3003││Svc  ││:3005││Svc  ││:3004││Svc  │
│     ││     ││     ││:5002││     ││:5003││     ││     │
└──┬──┘└──┬──┘└──┬──┘└──┬──┘└──┬──┘└──┬──┘└──┬──┘└──┬──┘
   │      │      │      │      │      │      │      │
   ▼      ▼      ▼      ▼      ▼      ▼      ▼      ▼
┌─────────────────────────────────────┐  ┌──────────┐  ┌──────────┐
│            MongoDB Instances        │  │ RabbitMQ │  │  Stripe  │
│         (per-service databases)     │  │  :5672   │  │   API    │
└─────────────────────────────────────┘  └──────────┘  └──────────┘
                                                        ┌──────────┐
                                                        │  Jitsi   │
                                                        │  Meet    │
                                                        └──────────┘
```

---

## 🛠 Tech Stack

### Backend

| Technology                | Purpose             |
| ------------------------- | ------------------- |
| **Node.js 18**            | Runtime environment |
| **Express 4/5**           | Web framework       |
| **MongoDB + Mongoose**    | Database & ODM      |
| **JWT**                   | Authentication      |
| **Stripe SDK**            | Payment processing  |
| **Google Gemini AI**      | AI symptom analysis |
| **Jitsi Meet**            | Video consultations |
| **RabbitMQ + amqplib**    | Message queue       |
| **Nodemailer**            | Email delivery      |
| **Cloudinary + Multer**   | File/image uploads  |
| **http-proxy-middleware** | API Gateway routing |

### Frontend

| Technology           | Purpose                  |
| -------------------- | ------------------------ |
| **React 18.3**       | UI framework             |
| **Vite 8**           | Build tool & dev server  |
| **TailwindCSS 3.4**  | Utility-first styling    |
| **Framer Motion 12** | Animations & transitions |
| **React Router 6**   | Client-side routing      |
| **Axios**            | HTTP client              |
| **Lucide React**     | Icon library             |
| **jsPDF**            | PDF generation           |
| **date-fns 4**       | Date utilities           |

### DevOps

| Technology                  | Purpose                   |
| --------------------------- | ------------------------- |
| **Docker & Docker Compose** | Containerization          |
| **Kubernetes**              | Container orchestration   |
| **Nginx**                   | Production client serving |

---

## 📂 Project Structure

```
MediLink/
├── client/                     # React SPA (Vite + TailwindCSS)
│   └── src/
│       ├── components/         # Reusable UI components
│       ├── contexts/           # Auth, Doctor, Admin, Theme contexts
│       ├── layouts/            # Patient, Doctor, Admin layouts
│       └── pages/              # Route pages (Public, Patient, Doctor, Admin)
│
├── api-gateway/                # Centralized API Gateway (15 route files)
├── auth-service/               # Authentication & user management
├── patient-service/            # Patient profiles & medical records
├── doctor-service/             # Doctor profiles, scheduling & prescriptions
├── appointment-service/        # Appointment booking & lifecycle
├── payment-service/            # Stripe payments, refunds & transactions
├── notification-service/       # Email & event-driven notifications
├── telemedicine-service/       # Video consultation sessions
├── ai-symptom-service/         # Gemini AI symptom analysis
│
├── k8s/                        # Production Kubernetes manifests
├── k8s-local/                  # Local K8s manifests (Docker Desktop)
├── k8s-dashboard/              # Custom K8s monitoring dashboard
│
├── docker-compose.yml          # Main orchestration (all services)
├── docker-compose.payment.yml  # Standalone MongoDB for payments
├── start.bat                   # Quick start script
└── stop.bat                    # Quick stop script
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (with Docker Compose)
- [Node.js 18+](https://nodejs.org/) (for local development)
- [Git](https://git-scm.com/)

### Environment Variables

Each microservice requires its own `.env` file. Create `.env` files in each service directory with the following keys:

<details>
<summary><b>Required Environment Variables</b></summary>

**Auth Service** (`.env`)

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
JWT_LIFETIME=30d
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**Patient Service** (`.env`)

```env
MONGO_URI=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

**Doctor Service** (`.env`)

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
APPOINTMENT_SERVICE_URL=http://appointment-service:5002
NOTIFICATION_SERVICE_URL=http://notification-service:5003
```

**Appointment Service** (`.env`)

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
```

**Payment Service** (`.env`)

```env
MONGO_URI=mongodb+srv://...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
JWT_SECRET=your_jwt_secret
```

**Notification Service** (`.env`)

```env
MONGO_URI=mongodb+srv://...
RABBITMQ_URL=amqp://rabbitmq:5672
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**Telemedicine Service** (`.env`)

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
```

**AI Symptom Service** (`.env`)

```env
GEMINI_API_KEY=your_gemini_api_key
```

**API Gateway** (`.env`)

```env
JWT_SECRET=your_jwt_secret
AUTH_SERVICE=http://auth-service:5000
PATIENT_SERVICE=http://patient-service:3001
DOCTOR_SERVICE=http://doctor-service:3003
APPOINTMENT_SERVICE=http://appointment-service:5002
PAYMENT_SERVICE=http://payment-service:3005
NOTIFICATION_SERVICE=http://notification-service:5003
TELEMEDICINE_SERVICE=http://telemedicine-service:3004
AI_SERVICE=http://ai-symptom-service:3001
```

</details>

### Quick Start (Docker)

```bash
# Clone the repository
git clone https://github.com/your-username/MediLink.git
cd MediLink

# Start all services
docker compose up -d

# Or use the helper script (Windows)
start.bat
```

The application will be available at:

| Service                 | URL                    |
| ----------------------- | ---------------------- |
| **Client (Frontend)**   | http://localhost:5173  |
| **API Gateway**         | http://localhost:5001  |
| **RabbitMQ Management** | http://localhost:15682 |

### Stop All Services

```bash
docker compose down

# Or use the helper script (Windows)
stop.bat
```

---

## ☸️ Kubernetes Deployment

MediLink includes Kubernetes manifests for both local development and production.

```bash
# Local deployment (Docker Desktop K8s)
kubectl apply -f k8s-local/namespace.yaml
kubectl apply -f k8s-local/ -R

# Monitor with the custom K8s dashboard
cd k8s-dashboard && npm start
# Dashboard available at http://localhost:4500
```

---

## 📡 API Reference

All requests go through the **API Gateway** at `http://localhost:5001`.

<details>
<summary><b>Authentication</b></summary>

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| `POST` | `/api/auth/register`        | Register new user      |
| `POST` | `/api/auth/login`           | Login                  |
| `POST` | `/api/auth/forgot-password` | Request password reset |
| `POST` | `/api/auth/reset-password`  | Reset password         |

</details>

<details>
<summary><b>Doctors</b></summary>

| Method  | Endpoint                                | Description                   |
| ------- | --------------------------------------- | ----------------------------- |
| `GET`   | `/api/doctors`                          | List all doctors              |
| `GET`   | `/api/doctors/:id`                      | Get doctor profile            |
| `GET`   | `/api/doctors/specialty/:specialty`     | Filter by specialty           |
| `POST`  | `/api/doctors/register`                 | Register doctor profile       |
| `PUT`   | `/api/doctors/:id`                      | Update profile                |
| `POST`  | `/api/doctors/:id/verification`         | Submit verification documents |
| `PATCH` | `/api/doctors/:id/verification/approve` | Approve verification (Admin)  |

</details>

<details>
<summary><b>Availability & Scheduling</b></summary>

| Method | Endpoint                                  | Description             |
| ------ | ----------------------------------------- | ----------------------- |
| `GET`  | `/api/availability/:doctorId`             | Get availability        |
| `GET`  | `/api/availability/slots/:doctorId/:date` | Get time slots for date |
| `POST` | `/api/availability/slots/:id/book`        | Book a time slot        |
| `POST` | `/api/availability/slots/:id/cancel`      | Cancel booking          |

</details>

<details>
<summary><b>Appointments</b></summary>

| Method | Endpoint                         | Description                   |
| ------ | -------------------------------- | ----------------------------- |
| `POST` | `/api/appointments`              | Create appointment            |
| `GET`  | `/api/appointments`              | List user appointments        |
| `PUT`  | `/api/appointments/:id/accept`   | Accept appointment (Doctor)   |
| `PUT`  | `/api/appointments/:id/complete` | Complete appointment (Doctor) |

</details>

<details>
<summary><b>Payments</b></summary>

| Method | Endpoint                       | Description                    |
| ------ | ------------------------------ | ------------------------------ |
| `POST` | `/api/payment/checkout`        | Create Stripe checkout session |
| `POST` | `/api/payment/verify-checkout` | Verify payment                 |
| `GET`  | `/api/payment`                 | List user payments             |
| `POST` | `/api/payment/:id/refund`      | Request refund                 |
| `GET`  | `/api/payment/admin/overview`  | Payment analytics (Admin)      |

</details>

<details>
<summary><b>Telemedicine</b></summary>

| Method  | Endpoint                                  | Description           |
| ------- | ----------------------------------------- | --------------------- |
| `POST`  | `/api/telemedicine/create-session`        | Create video session  |
| `PATCH` | `/api/telemedicine/:appointmentId/status` | Update session status |
| `PATCH` | `/api/telemedicine/:appointmentId/notes`  | Add clinical notes    |

</details>

<details>
<summary><b>AI Symptom Analysis</b></summary>

| Method | Endpoint                 | Description              |
| ------ | ------------------------ | ------------------------ |
| `POST` | `/api/ai/check-symptoms` | Analyze symptoms with AI |

</details>

---

## 🧩 Microservices

| Service                  | Port | Database | Key Responsibility                                                |
| ------------------------ | ---- | -------- | ----------------------------------------------------------------- |
| **API Gateway**          | 5001 | —        | Request routing, JWT auth, rate limiting                          |
| **Auth Service**         | 5000 | MongoDB  | Registration, login, password reset, email verification           |
| **Patient Service**      | 3001 | MongoDB  | Patient profiles, medical history, reports, file uploads          |
| **Doctor Service**       | 3003 | MongoDB  | Doctor profiles, verification, scheduling, prescriptions, reviews |
| **Appointment Service**  | 5002 | MongoDB  | Appointment CRUD, lifecycle management                            |
| **Payment Service**      | 3005 | MongoDB  | Stripe checkout, webhooks, refunds, transactions                  |
| **Notification Service** | 5003 | MongoDB  | Email notifications, RabbitMQ consumer                            |
| **Telemedicine Service** | 3004 | MongoDB  | Jitsi video sessions, consultation tracking                       |
| **AI Symptom Service**   | —    | —        | Gemini AI symptom analysis (stateless)                            |
| **RabbitMQ**             | 5672 | —        | Async message broker                                              |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is developed as an academic assignment. All rights reserved.

---

<div align="center">

**Built with ❤️ by the MediLink Team**

</div>
