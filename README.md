# Superfone Admin Backend

## 1. Project Overview

The **Superfone Admin Backend** manages users, calls, leads, teams, webhook logs, and phone numbers.  
It provides full control for administrative operations, analytics, and monitoring.

**Tech Stack:**  
- Backend: Node.js + Express  
- Database: PostgreSQL  
- Authentication: JWT-based for admin users  
- Logging: Winston/Log4js for admin actions and errors  

---

## 2. Folder Structure

admin-backend/
│
├── src/
│ ├── config/ # Configuration files
│ │ └── db.js # Database connection
│ ├── controllers/ # Route handlers / business logic
│ ├── routes/ # Express routes
│ ├── models/ # DB queries / ORM models
│ ├── middlewares/ # Auth, validation, and error handling
│ ├── utils/ # Utility functions
│ └── app.js # Express app setup (routes + middleware)
├── server.js # Server start file
├── .env # Environment variables
├── package.json # Project dependencies
├── package-lock.json
└── README.md # Project documentation

yaml
Copy code

---

## 3. Environment Variables (.env)

```env
PORT=5000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=app_db
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=1h
4. Authentication & Authorization
JWT Authentication: Admin logs in → receives token.

Roles: admin, superadmin.

Middleware:

authenticate.js → validates JWT.

authorizeRole.js → ensures admin access.

5. API Endpoints
Auth
Method	Endpoint	Description	Body	Response
POST	/api/admin/auth/login	Admin login	{email, password}	{token, admin}
POST	/api/admin/auth/logout	Logout	{}	{message}

Users
Method	Endpoint	Description	Body	Response
GET	/api/admin/users	Get all users	N/A	[userObjects]
GET	/api/admin/users/:id	Get user by ID	N/A	userObject
PUT	/api/admin/users/:id	Update user	{name?, email?, role?}	userObject
DELETE	/api/admin/users/:id	Delete user	N/A	{message}

Calls
Method	Endpoint	Description	Body	Response
GET	/api/admin/calls	List all calls	Query params: from?, to?, teamId?	[callObjects]
GET	/api/admin/calls/:id	Get call details	N/A	callObject

Leads
Method	Endpoint	Description	Body	Response
GET	/api/admin/leads	List all leads	Query params: userId?, teamId?	[leadObjects]
GET	/api/admin/leads/:id	Get lead details	N/A	leadObject
GET	/api/admin/leads/team/:team_id	Get team leads	N/A	leadObject
POST	/api/admin/leads	Create lead	{name, phoneNumber, teamId, assignedTo}	leadObject
PUT	/api/admin/leads/:id	Update lead	{name?, phoneNumber?, teamId?, assignedTo?}	leadObject
DELETE	/api/admin/leads/:id	Delete lead	N/A	{message}

Phone Numbers
Method	Endpoint	Description	Body	Response
GET	/api/admin/phones	List all numbers	Query params: userId?	[phoneObjects]
POST	/api/admin/phones	Add new number	{number, userId}	phoneObject
DELETE	/api/admin/phones/:id	Delete number	N/A	{message}

Teams
Method	Endpoint	Description	Body	Response
GET	/api/admin/teams	List all teams	N/A	[teamObjects]
GET	/api/admin/teams/:id	Get team	N/A	teamObject
POST	/api/admin/teams	Create team	{name, members[]}	teamObject
PUT	/api/admin/teams/:id	Update team	{name?, members?}	teamObject
DELETE	/api/admin/teams/:id	Delete team	N/A	{message}

Team Members
Method	Endpoint	Description	Body	Response
GET	/api/admin/team-members	List members	Query params: teamId?	[teamMemberObjects]
POST	/api/admin/team-members	Add member	{teamId, userId, role}	teamMemberObject
DELETE	/api/admin/team-members/:id	Remove member	N/A	{message}

Webhook Logs
Method	Endpoint	Description	Body	Response
GET	/api/admin/webhook-logs	List logs	Query params: eventType?, from?, to?, teamId?	[logObjects]
GET	/api/admin/webhook-logs/:id	Get log details	N/A	logObject

6. Error Handling
All errors return a standard response:

json
Copy code
{
  "success": false,
  "message": "Error message",
  "errors": []
}
Unhandled errors are caught in errorHandler.js.

7. Logging
Logs admin actions, errors, and API requests.

Example log file: logs/admin_actions.log.

8. Security Best Practices
Passwords hashed with bcrypt.

JWT stored in secure headers or cookies.

Validate and sanitize inputs.

Rate-limit admin endpoints.

Use HTTPS in production.