Hospital Management System — Frontend (Angular)

A responsive Single Page Application (SPA) providing an intuitive interface for patients, doctors, and hospital administrators. Integrated with a .NET 9 RESTful backend using JWT authentication.

🛠 Tech Stack

Framework: Angular (TypeScript)

State & Reactive Programming: RxJS Observables, BehaviorSubjects

Styling & UI: Responsive Modular CSS / HTML5, Interactive Dashboards

Security: HttpInterceptor for automatic JWT Bearer token injection and error handling

DevOps: Multi-stage Dockerfile (Nginx production serve), GitHub Actions CI/CD to Docker Hub

✨ Key Features

🗓 Doctor Scheduling Grid: Interactive calendar grid displaying availability, appointments, and patient status.

🏥 Patient Booking Portal: Seamless multi-step booking workflow with real-time balance checks and instant confirmation.

👨‍💼 Admin Control Dashboard: User role management, schedule creation, and system transaction oversight.

🔒 Role-Based Route Guards: Route protection based on claims contained in decoded JWT tokens.

🚀 Getting Started

Quick Start with Docker

# Pull and run the containerized Angular app
docker run -d -p 8080:80 denchik23083/hospital-frontend:latest

Open http://localhost:8080 in your browser.

Local Development

Clone the repository:

git clone https://github.com/Denchik23083/hospital-client.git cd hospital-client

Install Dependencies:

npm install


Run Development Server:

ng serve --open


Navigate to http://localhost:4200/.

👤 Author

Denys Kudriavov
