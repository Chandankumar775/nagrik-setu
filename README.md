
<div align="center">
  <img src="https://i.postimg.cc/zBZXPtFF/Jharkhand-Rajakiya-Chihna-svg.webp" alt="Jharkhand Government Logo" width="120" />
  <h1 align="center">Nagrik Setu</h1>
  <p align="center">
    Bridging the gap between citizens and governance for a smarter Jharkhand.
    <br />
    <em>An initiative by the Government of Jharkhand, developed by Team Urban Dons for the Smart India Hackathon.</em>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
    <img src="https://img.shields.io/badge/Genkit-F47C23?style=for-the-badge&logo=google-cloud&logoColor=white" alt="Genkit" />
  </p>
</div>

---

## 🌟 Introduction

**Nagrik Setu** (Citizen's Bridge) is a modern, AI-powered web application designed to empower the citizens of Jharkhand to report civic issues seamlessly. From potholes and broken streetlights to water leaks and overflowing trash bins, this platform provides a direct line to municipal authorities, ensuring that problems are identified, categorized, and resolved efficiently.

Our mission is to foster a culture of collaboration and transparency, making community improvement accessible to everyone. With an intuitive interface for citizens and a powerful dashboard for administrators, Nagrik Setu aims to revolutionize civic engagement and public service delivery.

This project was proudly developed as a prototype for the **Smart India Hackathon (SIH)**.

## ✨ Key Features

Nagrik Setu is built with two primary user experiences in mind: the public-facing citizen portal and the administrative dashboard.

### 🚶 For Citizens

- **Effortless Reporting**: Submit a civic issue in seconds without needing to create an account.
- **Multimedia Attachments**: Upload a photo of the issue for better clarity. Voice note functionality is planned for future releases.
- **Automatic Geolocation**: The platform automatically captures the precise location of the issue using the device's GPS.
- **AI-Powered Categorization**: Our intelligent backend, powered by Google's Gemini, automatically analyzes the report description to assign a category (e.g., "Pothole", "Water Leak") and assess its urgency.
- **Real-Time Tracking**: Receive a unique tracking ID upon submission to monitor the status of your report from "Submitted" to "Resolved".
- **Responsive Design**: A fully responsive and accessible UI that works beautifully on any device, from mobile phones to desktops.

### 🛡️ For Administrators

- **Comprehensive Dashboard**: A centralized dashboard providing a bird's-eye view of all reported issues.
- **Insightful Analytics**: Visualize key metrics such as total reports, urgent issues, resolution times, and report distribution by category and location.
- **Interactive Map View**: See all reported issues plotted on an interactive map to identify problem hotspots.
- **Detailed Report View**: Click on any report to see full details, including the description, photo, location, timeline, and current status.
- **Efficient Filtering**: Easily filter reports by status, category, or urgency to prioritize and manage workload.
- **Secure & Role-Based**: A secure admin panel to manage and update the status of reports, ensuring a clear workflow.

## 🚀 Tech Stack

The application is built using a modern, robust, and scalable technology stack.

- **Frontend**:
  - **Next.js**: For server-side rendering (SSR), static site generation, and a powerful React framework.
  - **React**: For building a dynamic and component-based user interface.
  - **TypeScript**: For type safety and improved developer experience.
- **Styling**:
  - **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
  - **ShadCN UI**: A collection of beautifully designed, accessible, and reusable components.
- **Generative AI**:
  - **Genkit (with Google AI)**: An open-source framework for building production-ready AI flows. We use Google's Gemini model for intelligent report categorization.
- **Deployment**:
  - **Firebase App Hosting**: For scalable, secure, and easy-to-manage hosting.

## 📂 Project Structure

The codebase is organized to maintain a clear separation of concerns, making it easy to navigate and extend.

```
/
├── src/
│   ├── app/                # Next.js App Router (pages, layouts, actions)
│   │   ├── admin/          # Admin dashboard routes
│   │   └── (public)/       # Public-facing routes (home, track)
│   ├── ai/                 # Genkit AI flows and configuration
│   ├── components/         # Reusable React components (ShadCN UI, custom)
│   ├── lib/                # Shared utilities, data store, and type definitions
│   └── hooks/              # Custom React hooks
├── public/                 # Static assets (images, fonts)
└── tailwind.config.ts      # Tailwind CSS configuration
```

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-repo/nagrik-setu.git
    cd nagrik-setu
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Google AI API Key.
    ```
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

4.  **Run the development server:**
    This command starts both the Next.js frontend and the Genkit AI flows concurrently.
    ```sh
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The Genkit development UI will be available at [http://localhost:4000](http://localhost:4000).

## 🏆 Meet the Team (Urban Dons)

This project is the result of the hard work and collaboration of a dedicated team.

| Name         | Role                |
|--------------|---------------------|
| **Chandan**  | 👑 Team Lead, Backend Engineer        |
| **Pranjal**  | 💻 Core Developer, Security and Devops   |
| **Ishita**   | 🎨 UI/UX Designer, Frontend Developer   |
| **Kirti**    | 🧠 AI Specialist    |
| **Krish**    | 📊 Mobile App Developer|
| **Aditya**   | 📝 UI/UX design    |

---

<div align="center">
  <p>Made with ❤️ for a better Jharkhand.</p>
</div>
