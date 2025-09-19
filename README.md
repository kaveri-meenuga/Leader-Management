# LeadFlow - Lead Management System

## Project Overview

LeadFlow is a modern, accessible lead management system built for sales teams to organize, track, and convert leads effectively.

## Features

- **Authentication**: Secure login/register with JWT tokens
- **Lead Management**: Complete CRUD operations for leads
- **Dashboard**: Interactive data table with pagination and filtering
- **Lead Tracking**: Status management and scoring system
- **Responsive Design**: Works perfectly on all devices
- **Accessibility**: WCAG compliant with excellent contrast ratios

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui components
- **State Management**: React Query for server state
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Development Setup

### Prerequisites

- Node.js 16+ and npm installed
- Git for version control

### Getting Started

```sh
# Clone the repository
git clone <your-repo-url>

# Navigate to the project directory
cd leadflow

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Build for Production

```sh
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── leads/          # Lead management components
│   ├── layout/         # Layout components
│   └── ui/             # Base UI components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── assets/             # Static assets
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_backend_api_url
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
