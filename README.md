# Stytch All Examples

Stytch provides SDKs for a number of different languages, frameworks, and implementations. This monorepo contains example apps you can try for our various frontend and backend SDKs.

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) installed on your machine.

### Installation

1. **Clone the repository:**

   ```bash
   git clone git@github.com:stytchauth/stytch-all-examples.git
   cd stytch-all-examples
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

## Running Example Apps

This monorepo contains multiple example applications organized by framework and implementation type. To run a specific example app:

1. **Navigate to the specific package you want to build**, for example:

   ```bash
   cd frontend/react/headless
   # or
   cd frontend/nextjs/headless
   # or
   cd frontend/vanillajs/headless
   # or
   cd frontend/vanillajs/prebuilt
   ```

2. **Follow the instructions in that package's README** for setup and running instructions specific to that implementation.

## Repository Structure

```bash
stytch-all-examples/
├── frontend/
│   ├── nextjs/
│   │   ├── headless/          # Next.js headless implementation
│   │   └── prebuilt/          # Next.js prebuilt implementation
│   ├── react/
│   │   ├── headless/          # React headless implementation
│   │   └── prebuilt/          # React prebuilt implementation
│   └── vanillajs/
│       ├── headless/          # Vanilla JavaScript headless implementation
│       └── prebuilt/          # Vanilla JavaScript prebuilt implementation
├── backend/
│   ├── golang/                # Go server implementation
│   ├── ui/                    # Shared React UI for backend examples
│   └── internal/              # Shared backend configuration
└── internal/                  # Shared components and utilities
```

## Implementation Types

### Headless Implementations

These implementations use the Stytch Headless SDK and build custom UI components from scratch:

- **React Headless**: Custom React components with Stytch Headless SDK
- **Next.js Headless**: Custom Next.js components with Stytch Headless SDK
- **Vanilla JavaScript Headless**: Custom HTML/CSS/JS with Stytch Headless SDK

### Prebuilt Implementations

These implementations use the Stytch Prebuilt SDK with pre-built UI components:

- **Next.js Prebuilt**: Uses Stytch Prebuilt SDK with Next.js
- **React Prebuilt**: Uses Stytch Prebuilt SDK with React components
- **Vanilla JavaScript Prebuilt**: Uses Stytch Prebuilt SDK with vanilla JavaScript

### Backend Implementations

These implementations provide server-side authentication handling:

- **Go Backend**: Go server with HTTP API endpoints for authentication
- **Shared UI**: React UI that works with backend implementations

## Features Demonstrated

All implementations demonstrate the following Stytch B2B features:

- **Magic Link Authentication**: Email-based passwordless authentication
- **Google OAuth Login**: One-click authentication with Google (opt-in)
- **Organization Management**: Create, list, and switch between organizations
- **Session Management**: View session tokens, JWT handling, and logout functionality
- **Error Handling**: Comprehensive error states and user feedback
- **Responsive Design**: Mobile-friendly layouts
- **Configurable OAuth**: Easy toggle to enable/disable OAuth features

## Quick Start

For a quick start, we recommend trying the **React Prebuilt** implementation as it requires minimal setup. See the [React Prebuilt README](frontend/react/prebuilt/README.md) for complete setup instructions.

For a full-stack example with backend integration, try the **Go Backend** implementation. See the [Go Backend README](backend/golang/README.md) for complete setup instructions.

## Support

For questions about Stytch SDKs, visit our [documentation](https://stytch.com/docs) or [community forum](https://community.stytch.com/).
