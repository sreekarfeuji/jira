# 🚀 Jira QA Bug Tracker — Serverless AWS Backend

A production-ready serverless backend for the **Jira QA Bug Tracker**, built with **AWS Lambda**, **Amazon DynamoDB**, and **Amazon S3**.

---

## 🏛️ Architecture Overview

```
                      +-----------------------------------+
                      |         React Frontend            |
                      +-----------------+-----------------+
                                        |
               +------------------------+------------------------+
               | REST API (JSON)                                 | Direct S3 Upload (Presigned URL)
               v                                                 v
    +----------------------+                           +-------------------+
    | Amazon API Gateway   |                           |     Amazon S3     |
    | (HTTP API)           |                           | (Attachments &    |
    +----------+-----------+                           |  Test Artifacts)  |
               |                                       +---------+---------+
               v                                                 |
    +----------------------+                                     | S3:ObjectCreated Event
    |      AWS Lambda      | <-----------------------------------+
    |  - getBugs           |
    |  - getBugById        |
    |  - createBug         |
    |  - updateBug         |
    |  - deleteBug         |
    |  - addNote           |
    |  - getPresignedUrl   |
    |  - s3AttachmentProc  |
    +----------+-----------+
               |
               v
    +----------------------+
    |   Amazon DynamoDB    |
    | (JiraQABugsTable)    |
    | PK: id               |
    | GSI: StatusIndex     |
    +----------------------+
```

---

## 🔑 AWS Services & Responsibilities

### 1. ⚡ AWS Lambda (Node.js 20.x runtime)
- **`getBugs`**: Retrieves all QA bugs or filters by workflow stage (`qa`, `done`, `approved`) with metrics summary.
- **`getBugById`**: Fetches single bug details and verification trail.
- **`createBug`**: Creates bug item in DynamoDB with auto-generated ID, reporter, and assignee.
- **`updateBug`**: Updates bug properties and transitions bug between stages (`qa` ➔ `done` ➔ `approved`).
- **`deleteBug`**: Permanently removes a bug from DynamoDB.
- **`addNote`**: Appends QA verification notes and reproduction logs.
- **`getPresignedUrl`**: Issues secure Amazon S3 pre-signed URLs for browser-to-S3 uploads without proxying heavy binary data through Lambda.
- **`s3AttachmentProcessor`**: Event-driven trigger that auto-indexes newly uploaded S3 attachments directly into the bug's record in DynamoDB.

### 2. 🗄️ Amazon DynamoDB
- **Table Name**: `JiraQABugsTable`
- **Primary Key**: `id` (String, e.g., `BUG-101`)
- **Billing Mode**: `PAY_PER_REQUEST` (On-Demand Capacity)
- **Global Secondary Index (GSI)**:
  - **Index Name**: `StatusIndex`
  - **Partition Key**: `status` (String: `qa` | `done` | `approved`)
  - **Sort Key**: `createdAt` (String: ISO timestamp)
  - **Projection**: `ALL`

### 3. 🪣 Amazon S3
- **Bucket**: `jira-qa-bug-attachments`
- **Prefix Structure**: `attachments/{bugId}/{uuid}-{fileName}`
- **Security**: Pre-signed URLs with configurable TTL (default 5 mins for upload, 15 mins for download).
- **CORS Configuration**: Enabled for browser PUT/GET requests directly to S3.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/bugs` | List all bugs (supports `?status=qa\|done\|approved`) |
| `GET` | `/bugs/{id}` | Get bug details by ID |
| `POST` | `/bugs` | Create a new bug |
| `PUT` / `PATCH` | `/bugs/{id}` | Update bug (move status, edit title, etc.) |
| `DELETE` | `/bugs/{id}` | Delete a bug |
| `POST` | `/bugs/{id}/notes` | Add a QA verification note |
| `POST` | `/attachments/presigned-url` | Generate S3 pre-signed upload/download URL |
| `GET` | `/health` | Health check and configuration status |

---

## 💻 Local Development

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Local Server
```bash
npm run dev
```
The server will start at `http://localhost:5000` with hot reloading.

### 4. Seed Initial Data
```bash
npm run seed
```

---

## ☁️ Deployment to AWS

### Option A: Serverless Framework
```bash
cd backend
# Deploy to dev
npm run deploy

# Deploy to production
npm run deploy:prod
```

### Option B: AWS SAM (Serverless Application Model)
```bash
cd backend
sam build
sam deploy --guided
```
