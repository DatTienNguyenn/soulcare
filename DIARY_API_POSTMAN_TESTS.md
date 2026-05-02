# Diary API - Postman Test Guide

## Base URL

```
http://localhost:8080
```

## Authentication

All requests require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

**Important:** You must be registered as a PATIENT to use the Diary API. First:

1. Register as a PATIENT using `/api/v1/auth/register`
2. Login using `/api/v1/auth/login` to get the JWT token
3. Use that token in all diary API requests

---

## Authentication Setup (Do This First!)

### Step 1: Register as Patient

**Endpoint:** `POST /api/v1/auth/register`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "patient@example.com",
  "password": "Password123!",
  "role": "PATIENT",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Step 2: Login

**Endpoint:** `POST /api/v1/auth/login`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "patient@example.com",
  "password": "Password123!"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Step 3: Save JWT Token

Copy the token from the login response and set it as an environment variable:

```
jwt_token = <your_token_here>
```

---

## Test Scenarios

### 1. CREATE DIARY ENTRY

**Endpoint:** `POST /api/v1/diaries`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**⚠️ IMPORTANT - Postman Setup:**

- Go to **Body** tab
- Click **raw** (not "form-data")
- Select **JSON** from the dropdown (right side)
- Then paste the request body below

**Request Body:**

```json
{
  "title": "My First Diary Entry",
  "content": "Today was a wonderful day. I accomplished my goals and felt productive.",
  "mood": "HAPPY",
  "tags": ["productive", "reflection", "gratitude"],
  "status": "PUBLISHED",
  "diaryDate": "2026-05-02"
}
```

**Expected Response (201 Created):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "patientId": "patient-uuid",
  "title": "My First Diary Entry",
  "content": "Today was a wonderful day. I accomplished my goals and felt productive.",
  "mood": "HAPPY",
  "hashtag": "productive,reflection,gratitude",
  "status": "PUBLISHED",
  "diaryDate": "2026-05-02",
  "createdAt": "2026-05-02T10:30:00",
  "lastUpdate": "2026-05-02T10:30:00"
}
```

**Postman Test Script:**

```javascript
pm.test("Status code is 201", function () {
  pm.response.to.have.status(201);
});

pm.test("Response contains diary ID", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.id).to.exist;
});

pm.test("Mood is saved correctly", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.mood).to.equal("HAPPY");
});

// Save ID for later tests
pm.environment.set("diaryId", pm.response.json().id);
```

---

### 2. GET ALL DIARIES

**Endpoint:** `GET /api/v1/diaries`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Expected Response (200 OK):**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "patientId": "patient-uuid",
    "title": "My First Diary Entry",
    "content": "Today was a wonderful day...",
    "mood": "HAPPY",
    "hashtag": "productive,reflection,gratitude",
    "status": "PUBLISHED",
    "diaryDate": "2026-05-02",
    "createdAt": "2026-05-02T10:30:00",
    "lastUpdate": "2026-05-02T10:30:00"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "patientId": "patient-uuid",
    "title": "Another Entry",
    "content": "Had a productive meeting...",
    "mood": "CALM",
    "hashtag": "work,meetings",
    "status": "PUBLISHED",
    "diaryDate": "2026-05-01",
    "createdAt": "2026-05-01T14:20:00",
    "lastUpdate": "2026-05-01T14:20:00"
  }
]
```

**Postman Test Script:**

```javascript
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Response is an array", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData).to.be.an("array");
});

pm.test("Array contains at least one diary", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.length).to.be.greaterThan(0);
});

pm.test("Each diary has required fields", function () {
  var jsonData = pm.response.json();
  jsonData.forEach(function (diary) {
    pm.expect(diary.id).to.exist;
    pm.expect(diary.title).to.exist;
    pm.expect(diary.content).to.exist;
    pm.expect(diary.mood).to.exist;
  });
});
```

---

### 3. GET SINGLE DIARY

**Endpoint:** `GET /api/v1/diaries/{{diaryId}}`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Expected Response (200 OK):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "patientId": "patient-uuid",
  "title": "My First Diary Entry",
  "content": "Today was a wonderful day...",
  "mood": "HAPPY",
  "hashtag": "productive,reflection,gratitude",
  "status": "PUBLISHED",
  "createdAt": "2026-05-02T10:30:00",
  "lastUpdate": "2026-05-02T10:30:00"
}
```

**Postman Test Script:**

```javascript
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Response ID matches request ID", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.id).to.equal(pm.environment.get("diaryId"));
});

pm.test("Diary has complete structure", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData).to.have.all.keys(
    "id",
    "patientId",
    "title",
    "content",
    "mood",
    "hashtag",
    "status",
    "createdAt",
    "lastUpdate",
  );
});
```

---

### 4. UPDATE DIARY ENTRY

**Endpoint:** `PUT /api/v1/diaries/{{diaryId}}`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**⚠️ IMPORTANT - Postman Setup:**

- Go to **Body** tab
- Click **raw** (not "form-data")
- Select **JSON** from the dropdown (right side)

**Request Body:**

```json
{
  "title": "Updated Diary Entry - Improved",
  "content": "This entry has been updated with more reflections and insights from the day.",
  "mood": "EXCITED",
  "tags": ["updated", "growth", "learning"],
  "status": "PUBLISHED",
  "diaryDate": "2026-05-02"
}
```

**Expected Response (200 OK):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "patientId": "patient-uuid",
  "title": "Updated Diary Entry - Improved",
  "content": "This entry has been updated with more reflections and insights from the day.",
  "mood": "EXCITED",
  "hashtag": "updated,growth,learning",
  "status": "PUBLISHED",
  "diaryDate": "2026-05-02",
  "createdAt": "2026-05-02T10:30:00",
  "lastUpdate": "2026-05-02T11:45:00"
}
```

**Postman Test Script:**

```javascript
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Title was updated", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.title).to.equal("Updated Diary Entry - Improved");
});

pm.test("Mood was updated", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.mood).to.equal("EXCITED");
});

pm.test("Update timestamp changed", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.lastUpdate).to.not.equal(jsonData.createdAt);
});
```

---

### 5. DELETE DIARY ENTRY

**Endpoint:** `DELETE /api/v1/diaries/{{diaryId}}`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Expected Response (204 No Content)**

**Postman Test Script:**

```javascript
pm.test("Status code is 204", function () {
  pm.response.to.have.status(204);
});

pm.test("Response has no body", function () {
  pm.expect(pm.response.text()).to.be.empty;
});
```

---

### 6. GET DIARIES BY DATE RANGE

**Endpoint:** `GET /api/v1/diaries/range?startDate=2026-05-01T00:00:00&endDate=2026-05-02T23:59:59`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

- `startDate`: ISO format date (e.g., 2026-05-01T00:00:00)
- `endDate`: ISO format date (e.g., 2026-05-02T23:59:59)

**Expected Response (200 OK):**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "patientId": "patient-uuid",
    "title": "Entry from May 2",
    "content": "...",
    "mood": "HAPPY",
    "hashtag": "productive",
    "status": "PUBLISHED",
    "createdAt": "2026-05-02T10:30:00",
    "lastUpdate": "2026-05-02T10:30:00"
  }
]
```

**Postman Test Script:**

```javascript
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Response is an array", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData).to.be.an("array");
});

pm.test("All diaries are within date range", function () {
  var jsonData = pm.response.json();
  var startDate = new Date("2026-05-01T00:00:00");
  var endDate = new Date("2026-05-02T23:59:59");

  jsonData.forEach(function (diary) {
    var diaryDate = new Date(diary.createdAt);
    pm.expect(diaryDate.getTime()).to.be.greaterThanOrEqual(
      startDate.getTime(),
    );
    pm.expect(diaryDate.getTime()).to.be.lessThanOrEqual(endDate.getTime());
  });
});
```

---

## Error Scenarios

### 7. INVALID MOOD VALUE

**Endpoint:** `POST /api/v1/diaries`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**⚠️ IMPORTANT - Postman Setup:**

- Go to **Body** tab
- Click **raw** (not "form-data")
- Select **JSON** from the dropdown (right side)

**Request Body (Invalid):**

```json
{
  "title": "Test Entry",
  "content": "This has an invalid mood",
  "mood": "INVALID_MOOD",
  "tags": [],
  "status": "PUBLISHED",
  "diaryDate": "2026-05-02"
}
```

**Expected Response (400 Bad Request):**

```json
{
  "error": "Invalid mood value"
}
```

---

### 8. MISSING REQUIRED FIELDS

**Endpoint:** `POST /api/v1/diaries`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**⚠️ IMPORTANT - Postman Setup:**

- Go to **Body** tab
- Click **raw** (not "form-data")
- Select **JSON** from the dropdown (right side)

**Request Body (Missing title):**

```json
{
  "content": "Missing title field",
  "mood": "CALM",
  "tags": [],
  "status": "PUBLISHED",
  "diaryDate": "2026-05-02"
}
```

**Expected Response (400 Bad Request):**

```json
{
  "error": "Title is required"
}
```

---

### 9. DIARY NOT FOUND

**Endpoint:** `GET /api/v1/diaries/invalid-uuid-123`

**Expected Response (404 Not Found):**

```json
{
  "error": "Diary not found"
}
```

**Postman Test Script:**

```javascript
pm.test("Status code is 404", function () {
  pm.response.to.have.status(404);
});
```

---

### 10. UNAUTHORIZED REQUEST

**Endpoint:** `GET /api/v1/diaries`

**Headers (Missing Authorization):**

```
Content-Type: application/json
```

**Expected Response (401 Unauthorized):**

```json
{
  "error": "Unauthorized"
}
```

**Postman Test Script:**

```javascript
pm.test("Status code is 401", function () {
  pm.response.to.have.status(401);
});
```

---

## Mood Types (Valid Values)

```
NEUTRAL
HAPPY
SAD
EXCITED
CALM
STRESS
```

## Diary Status Types

```
DRAFT
PUBLISHED
ARCHIVED
```

---

## Full Test Collection Order

1. ✅ Create Diary Entry (saves ID to environment)
2. ✅ Get All Diaries
3. ✅ Get Single Diary (uses saved ID)
4. ✅ Update Diary Entry (uses saved ID)
5. ✅ Get All Diaries (verify update)
6. ✅ Get Diaries by Date Range
7. ✅ Delete Diary Entry (uses saved ID)
8. ✅ Get All Diaries (verify deletion)
9. ❌ Invalid Mood Value
10. ❌ Missing Required Fields
11. ❌ Diary Not Found
12. ❌ Unauthorized Request

---

## Environment Variables to Set

Create these in Postman environment:

```
{
  "base_url": "http://localhost:8080",
  "jwt_token": "<your_jwt_token_here>",
  "diaryId": "<will_be_set_by_tests>"
}
```

Then use in requests:

- Base URL: `{{base_url}}`
- Authorization: `Bearer {{jwt_token}}`
- Diary ID: `{{diaryId}}`
