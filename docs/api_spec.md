# Task Management System — Backend API Specification (for Django)

This document describes the backend API the frontend expects. It includes data models (TypeScript shapes), endpoints, validation rules, example requests/responses, and notes for implementation in Django (DRF recommended).

---

**Project summary**
- Frontend: Next.js + TypeScript. Key UI pieces: admin templates, user task table (drag/drop), per-step triggers (popup, relation, completed), notes, per-row final columns, local-saving to `localStorage`.
- The frontend assumes standard REST endpoints for authentication, templates, categories, and tasks.

**Important**: All endpoints below should require authentication (JWT or session cookie). Responses use JSON. Use status codes 200/201/204/400/401/403/404/422 as appropriate.

---

## TypeScript / Backend Models (canonical shapes)
Copy these to the backend serializer definitions (Django REST Framework) and use them to validate payloads.

Types below are taken from `src/global/types.ts` and adapted for API schemas.

- StepKey (internal)
- FixedColumnKey (internal)
- FinalColumnKey = "statusTL" | "completed"

TypeScript interfaces (send as JSON schemas in DRF serializers):

TaskRow (serialized user task)
- id: string (UUID recommended)
- createdAt?: ISO 8601 string
- updatedAt?: ISO 8601 string
- color: string (HEX or CSS color)
- category?: { id: number, color: string, name: string }
- template: AdminTemplate (embedded or reference id in some endpoints)
- taskLineChecked: boolean
- timeSensitiveDate: string | null (ISO 8601 date)
- timeSensitiveColors: {
    warning: { days: number, color: string },
    danger: { days: number, color: string }
  }
- otherColumns: Array<{ columnId: number, name: string, type: "text" | "check" | "date", value?: string }>
- steps: ListStep[]
- statusTL: boolean
- completed: boolean
- columnDetails?: ColumnDetails

ListStep (step inside a TaskRow)
- id?: number (server-assigned)
- columnId: number
- columnDetails?: ColumnDetails
- name: string
- markedNext?: boolean
- markedNextRed?: boolean
- completed: boolean
- notes?: string
- description: string
- triggerType: "popup" | "relation" | "completed"
- popup?: { description: string }
- linkedStep?: { id: number, futureColumnThings?: Array<{ needed: boolean, description: string }> }

AdminTemplate
- id: string (UUID or slug)
- name: string
- categories: Categories[]
- description: string
- createdAt?: ISO string
- updatedAt?: ISO string
- timeSensitiveColors?: { warning: { days: number, color: string }, danger: { days: number, color: string } }
- steps: Array of Step objects (Omit<Step, "completed" | "timeSensitiveDate">)

Step (admin template step)
- id: number
- name: string
- description?: string
- type?: "text" | "check" | "date"
- trigger?: "popup" | "relation" | "completed"
- popup?: { description: string | null } | null
- linkedStep?: { id: number, futureColumnThings?: Array<{ needed: boolean, description: string }> } | null
- columnDetailsChecked: boolean
- columnDetails?: ColumnDetails

Categories
- id: number
- name: string
- color: string

ColumnDetails
- Array of { description: string; copyEnabled: boolean; category: Categories }

---

## Validation constraints (suggested)
- `id` (TaskRow, AdminTemplate): UUID v4 string (or integer PK, but frontend expects stable string ids).
- `name`: string, required, max 200 chars.
- `description`: string, optional, max 1000 chars.
- `color`: string, required, regex for HEX `^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$` or accept CSS color names.
- `timeSensitiveDate`: ISO 8601 date (YYYY-MM-DD or full timestamp), may be null.
- `steps`: array, min 1, max 50.
- `ListStep.completed`: boolean.
- `triggerType`: enum: `popup`, `relation`, `completed`.
- `otherColumns[].type`: enum: `text`, `check`, `date`.
- `categories[].id`: integer if stored server-side.
- For relation/linkedStep.futureColumnThings: `needed` boolean, `description` string max 200.

---

## Authentication
- Use JWT (Authorization: Bearer <token>) or session cookies.
- Endpoints below marked `Auth: required` mean the user must be authenticated.

### Auth endpoints (suggested)
- POST `/api/auth/login/`
  - Body: { username: string, password: string }
  - Response 200: { token: string, user: { id: number|string, username: string, email?: string } }
- POST `/api/auth/logout/` — Auth required, clears token/cookie.
- GET `/api/auth/me/` — Auth required, returns user profile.

---

## Templates (Admin) — manage reusable templates
Auth required: yes (admin role suggested)

- GET `/api/templates/`
  - Query: `?page=1&page_size=25`
  - Response 200: { results: AdminTemplate[], count, next, previous }

- GET `/api/templates/:id/`
  - Response 200: AdminTemplate

- POST `/api/templates/`
  - Body (AdminTemplateCreate):
    {
      name: string (required),
      description?: string,
      categories?: [{ id?: number, name: string, color: string }],
      timeSensitiveColors?: { warning: { days:number, color:string }, danger: { days:number, color:string } },
      steps: [ { id?:number, name: string, description?: string, type?: "text"|"check"|"date", trigger?: "popup"|"relation"|"completed", popup?:{description:string|null}, linkedStep?:{id:number} } ]
    }
  - Response 201: AdminTemplate

- PATCH `/api/templates/:id/` or PUT — update template
- DELETE `/api/templates/:id/` — delete template

Notes:
- Steps in templates can reference each other via `linkedStep.id` (numeric index or server id). Ensure `id` uniqueness.
- `steps` order matters — frontend derives columns from step order.

---

## Categories
- GET `/api/categories/`
- POST `/api/categories/` — create { name, color }
- PATCH/DELETE `/api/categories/:id/`

Categories are referenced from templates and tasks by `id`.

---

## Tasks (User) — core endpoints used by the UI
Auth required: yes

- GET `/api/tasks/`
  - Query params: `?template_id=<id>&page=<n>&page_size=<n>&sort=<field>`
  - Response 200: { results: TaskRow[], count, next, previous }
  - Sorting options: `completed`, `progress`, `categoryColor`, `closestDate` (implement in backend as needed)

- GET `/api/tasks/:id/`
  - Response 200: TaskRow

- POST `/api/tasks/` — create a new task row
  - Body options (two flavors):
    1) Create from template id (preferred): { template_id: string, color?: string, category_id?: number, timeSensitiveDate?: string }
       - Server will expand template steps into `steps` array for the user with `completed=false`.
    2) Create with full payload (for migrations or bulk save): full TaskRow object (see serializer rules)
  - Response 201: TaskRow

- PATCH `/api/tasks/:id/` — partial update
  - Body: any subset of TaskRow fields (e.g., title, color, category_id, timeSensitiveDate, otherColumns)
  - Response 200: TaskRow

- PUT `/api/tasks/:id/` — replace entire TaskRow (if desired)

- DELETE `/api/tasks/:id/` — remove a task

- PATCH `/api/tasks/:id/steps/:step_id/` — update a single step
  - Body: { completed?: boolean, notes?: string, markedNext?: boolean, markedNextRed?: boolean, linkedStep?: { id, futureColumnThings? } }
  - Response 200: updated ListStep or updated TaskRow
  - Note: For triggers, frontend may need server to update `linkedStep.futureColumnThings` when a relation step completes.

- POST `/api/tasks/:id/steps/:step_id/trigger/` — perform step trigger actions (optional)
  - Body: { action: "complete" | "relation-update", payload?: any }
  - Response 200: TaskRow (updated)

- PATCH `/api/tasks/order/` — reorder the user's tasks (from drag-and-drop)
  - Body: { ordered_ids: string[] }
  - Response 200: { success:true }
  - Note: Server should persist an ordering index field for each task (e.g., `order: integer`), scoped per user and/or template.

- POST `/api/tasks/bulk_save/` — accept snapshot from frontend `localStorage` when the user clicks "Save" (optional but recommended)
  - Body: { tasks: TaskRow[] }
  - Response 200: { tasks: TaskRow[] } (server-created/updated records)
  - Behavior: server should upsert tasks by `id`. Validate ownership.

---

## Step-specific behaviors and endpoints (how frontend uses step triggers)
- Trigger types:
  - `completed`: just mark the step completed when toggled.
  - `popup`: frontend shows a confirmation popup; server simply receives `completed=true` afterwards.
  - `relation`: when a step has `linkedStep`, on completion the frontend may open a UI to select `futureColumnThings`. The server should accept updates to both the completed step and `linkedStep.futureColumnThings`.

Example relation update flow:
1. Frontend user completes `stepA` (trigger=relation)
2. Frontend shows choices and collects `futureColumnThings` list
3. Frontend sends PATCH `/api/tasks/:id/steps/:stepA_id/` with body: `{ completed: true, linkedStep: { id: <linkedStepId>, futureColumnThings: [ { needed:true, description: "..." } ] } }`
4. Server marks stepA completed and updates the linked step to set `markedNext` or store `futureColumnThings` for the linked step.

---

## Notes on ordering, progress and computed fields
- `progress` is computed as (# of completed steps) / (total steps). The frontend computes this — the backend may also provide `progress` field in list endpoints to help sorting.
- `closestDate` sorting: server should compute earliest time-sensitive date among steps or `timeSensitiveDate` per task.

---

## Example request/responses (cURL)

Login

```bash
curl -X POST https://your-api.example.com/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"hunter2"}'
```

Create task from template

```bash
curl -X POST https://your-api.example.com/api/tasks/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{ "template_id": "550e8400-e29b-41d4-a716-446655440000", "color":"#ff9900", "category_id": 3 }'
```

Toggle a step as completed (PATCH)

```bash
curl -X PATCH https://your-api.example.com/api/tasks/abc123/steps/5/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{ "completed": true }'
```

Bulk save snapshot

```bash
curl -X POST https://your-api.example.com/api/tasks/bulk_save/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{ "tasks": [ /* array of TaskRow objects from frontend localStorage */ ] }'
```

---

## Implementation tips for Django (DRF)
- Use `rest_framework` with `ModelSerializer` and nested serializers for `steps`.
- Use `UUIDField` for IDs (or the DB integer PK, but expose as string UUID if frontend expects string ids).
- For reordering, store an `order` integer/float in TaskRow model, and update in a single transaction when `/tasks/order/` is called.
- Use `select_related`/`prefetch_related` for `template` and `steps` when serializing lists.
- Enforce ownership: every TaskRow should reference a `user` foreign key and endpoints must only operate on tasks belonging to the authenticated user.
- For `bulk_save`, perform upserts using `id` to match existing tasks (validate ownership) and create new ones.

---

## Gaps & questions for you (to hand to backend dev)
- Confirm how frontend authenticates (JWT bearer vs cookies). The code expects `localStorage` for task snapshot but no explicit auth wiring in attachments.
- Confirm whether `AdminTemplate` should be embedded inside `TaskRow` or referenced by ID only. Frontend expects `template` object in `TaskRow` — recommend returning a minimal `template` object in task GET responses.
- Confirm the `FinalColumnKey` values (`statusTL`, `completed`) map to boolean flags in TaskRow. Backend must expose these boolean columns.
- Confirm allowed color format (HEX vs CSS names).
- Decide whether `categories` are global or per-template.

---

## Deliverables included
- This `docs/api_spec.md` file (you can hand to the Django developer)
- Key TypeScript models copied from `src/global/types.ts` (use them to create serializers)

---

If you want, I can:
- Generate DRF `models.py` and `serializers.py` stubs from these interfaces.
- Provide OpenAPI/Swagger schemas for the endpoints above.

Tell me which you prefer next.
