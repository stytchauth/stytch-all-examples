# Stytch All Examples

Stytch provides SDKs for a number of different languages, frameworks, and implementation approaches. This monorepo contains simple example apps that demonstrate our various frontend and backend SDKs.

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) (Node Version Manager)

### Installation

1. **Clone the repository:**

   ```bash
   git clone git@github.com:stytchauth/stytch-all-examples.git
   cd stytch-all-examples
   ```

2. **Switch to the correct Node.js version:**

   ```bash
   nvm use
   ```

3. **Install dependencies:**
   ```bash
   yarn install
   ```

## Implementation Types

Before exploring the repository, it's helpful to understand the different types of implementations:

- **Headless**: You build your own UI from scratch using Stytch Headless SDK methods - full control over styling and user experience
- **Prebuilt**: Uses Stytch's pre-built UI components with minimal setup - faster to implement but less customization
- **Backend**: Server-side authentication handling with custom UI - demonstrates API integration patterns

## Repository Structure & Getting Started

This monorepo contains example applications organized by framework and implementation type. To run a specific example app:

1. **Navigate to the specific package you want to build**

2. **Follow the instructions in that package's README** for setup and running instructions specific to that implementation.

```bash
stytch-all-examples/
├── frontend/
│   ├── nextjs/
│   │   ├── [headless/](frontend/nextjs/headless/)          # Next.js headless implementation
│   │   └── [prebuilt/](frontend/nextjs/prebuilt/)          # Next.js prebuilt implementation
│   ├── react/
│   │   ├── [headless/](frontend/react/headless/)           # React headless implementation
│   │   └── [prebuilt/](frontend/react/prebuilt/)           # React prebuilt implementation
│   └── vanillajs/
│       ├── [headless/](frontend/vanillajs/headless/)       # Vanilla JavaScript headless implementation
│       └── [prebuilt/](frontend/vanillajs/prebuilt/)       # Vanilla JavaScript prebuilt implementation
├── backend/
│   ├── [golang/](backend/golang/)                          # Go server implementation
│   ├── [ui/](backend/ui/)                                  # Shared React UI for backend examples
│   └── internal/                                           # Shared backend configuration
└── internal/                                               # Shared components and utilities
```

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
