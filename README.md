# Stytch Example Apps

Stytch provides SDKs for a number of different languages, frameworks, and implementation approaches. This monorepo contains simple example apps that demonstrate our various frontend and backend SDKs.

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) (Node Version Manager)

### Stytch Dashboard Setup

Before running any example apps, you'll need to configure your Stytch project:

1. **Enable the Frontend SDK**: Go to your [Stytch Dashboard](https://stytch.com/dashboard) → **Frontend SDK** page → enable the **Frontend SDK**

2. **Get your credentials**: On the **Project Overview** page, you'll find:
   - **Project ID** - Used by backend applications
   - **Public Token** - Used by frontend applications
   - **Secret** - Used by backend applications for server-side operations

> 💡 **Tip:** The Project Overview page shows all the credentials you need for each app type. Frontend apps typically need the Public Token, while backend apps need the Project ID and Secret.

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

This monorepo contains example applications organized by framework, implementation type, and Stytch data model (B2B vs Consumer). To run a specific example app:

1. **Navigate to the specific package you want to build**

2. **Follow the instructions in that package's README** for setup and running instructions specific to that implementation.

```bash
stytch-all-examples/
├── frontend/
│   ├── nextjs/
│   │   ├── headless/
│   │   │   ├── b2b/           # Next.js headless B2B implementation
│   │   │   └── consumer/      # Next.js headless Consumer implementation
│   │   └── prebuilt/
│   │       ├── b2b/           # Next.js prebuilt B2B implementation
│   │       └── consumer/      # Next.js prebuilt Consumer implementation
│   ├── react/
│   │   ├── headless/
│   │   │   ├── b2b/           # React headless B2B implementation
│   │   │   └── consumer/      # React headless Consumer implementation
│   │   └── prebuilt/
│   │       ├── b2b/           # React prebuilt B2B implementation
│   │       └── consumer/      # React prebuilt Consumer implementation
│   └── vanillajs/
│       ├── headless/
│       │   ├── b2b/           # Vanilla JS headless B2B implementation
│       │   └── consumer/      # Vanilla JS headless Consumer implementation
│       └── prebuilt/
│           ├── b2b/           # Vanilla JS prebuilt B2B implementation
│           └── consumer/      # Vanilla JS prebuilt Consumer implementation
├── backend/
│   ├── golang/
│   │   ├── b2b/               # Go B2B server implementation
│   │   └── consumer/          # Go Consumer server implementation
│   └── ui/
│       ├── b2b/               # Shared React UI for B2B backend examples
│       └── consumer/          # Shared React UI for Consumer backend examples
└── internal/                  # Shared components and utilities
```

### Quick Links

**Frontend Apps:**

**B2B Apps:**

- [React B2B Headless](frontend/react/headless/b2b/) | [React B2B Prebuilt](frontend/react/prebuilt/b2b/)
- [Next.js B2B Headless](frontend/nextjs/headless/b2b/) | [Next.js B2B Prebuilt](frontend/nextjs/prebuilt/b2b/)
- [Vanilla JS B2B Headless](frontend/vanillajs/headless/b2b/) | [Vanilla JS B2B Prebuilt](frontend/vanillajs/prebuilt/b2b/)

**Consumer Apps:**

- [React Consumer Headless](frontend/react/headless/consumer/) | [React Consumer Prebuilt](frontend/react/prebuilt/consumer/)
- [Next.js Consumer Headless](frontend/nextjs/headless/consumer/) | [Next.js Consumer Prebuilt](frontend/nextjs/prebuilt/consumer/)
- [Vanilla JS Consumer Headless](frontend/vanillajs/headless/consumer/) | [Vanilla JS Consumer Prebuilt](frontend/vanillajs/prebuilt/consumer/)

**Backend Apps:**

- [Go B2B Backend](backend/golang/b2b/) | [Go Consumer Backend](backend/golang/consumer/)
- [B2B UI](backend/ui/b2b/) | [Consumer UI](backend/ui/consumer/)

## Features Demonstrated

All implementations demonstrate the following Stytch SDK capabilities:

- **Magic Link Authentication**: Email-based passwordless authentication
- **Google OAuth Login**: One-click authentication with Google (opt-in)
- **Session Management**: View session tokens, JWT handling, and logout functionality
- **Organization Management** (B2B only): Create, list, and switch between organizations

## Quick Start

For a quick start, we recommend trying one of these implementations:

**B2B Applications:**

- **React B2B Prebuilt**: Minimal setup with Stytch's hosted UI. See the [React B2B Prebuilt README](frontend/react/prebuilt/b2b/README.md) for complete setup instructions.
- **Go B2B Backend**: Full-stack example with backend integration. See the [Go B2B Backend README](backend/golang/b2b/README.md) for complete setup instructions.

**Consumer Applications:**

- **React Consumer Prebuilt**: Minimal setup with Stytch's hosted UI. See the [React Consumer Prebuilt README](frontend/react/prebuilt/consumer/README.md) for complete setup instructions.
- **Go Consumer Backend**: Full-stack example with backend integration. See the [Go Consumer Backend README](backend/golang/consumer/README.md) for complete setup instructions.

## Support

For questions about Stytch SDKs, visit our [documentation](https://stytch.com/docs) or [community forum](https://community.stytch.com/).
