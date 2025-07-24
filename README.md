## Overview

**ClientSync Alpha** is a project that demonstrates real-world integration between a Laravel backend and HubSpot’s CRM platform via OAuth2. It includes a React-based frontend and showcases essential CRM functions like syncing contacts, handling webhooks, and managing pipelines.

---

## Features

- 🔐 OAuth2 authentication with HubSpot
- 📥 Sync HubSpot contacts and companies into your app
- 🔄 Webhook handling for real-time updates
- 📊 Custom pipeline and deal stage syncing
- 🧠 React + Redux frontend with React Router
- 🛠 Laravel 12 backend with API routes and service-based architecture

---

## Tech Stack

| Backend | Frontend | Integration |
|---------|----------|-------------|
| Laravel 12 | React + Vite | HubSpot CRM API |
| MySQL | Redux Toolkit | OAuth2 (HubSpot) |
| RESTful API | Bootstrap | Webhooks |

---

## Local Setup

1. **Clone the repo**:

```bash
git clone https://github.com/theo-georgewill/clientsync-alpha.git
cd clientsync-alpha
```

2. Set up the backend (Laravel)

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
```

3. Set up the frontend (React)
```bash
cd ../frontend
npm install
npm run dev
```
4. Configure your .env with your HubSpot credentials:
```dotenv
HUBSPOT_CLIENT_ID=your-client-id
HUBSPOT_CLIENT_SECRET=your-client-secret
HUBSPOT_REDIRECT_URI=http://localhost:8000/hubspot/callback
```
📬 Webhook Endpoint
Use this URL to configure HubSpot webhooks:
```ruby
https://yourdomain.com/api/webhook/hubspot
🧩 Folder Structure
clientsync-alpha/
├── backend/ (Laravel)
├── frontend/ (React + Vite)
├── README.md
```
Learning Objectives

Integrate HubSpot CRM with custom Laravel backend

Build scalable full-stack systems

Handle OAuth2, API requests, and event-driven webhooks

Use GitHub professionally with pull requests and feature branches

Author
Theo Georgewill
LinkedIn | Portfolio

License
MIT – Use, modify, and build upon this project freely.