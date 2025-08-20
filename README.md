# Stytch All Examples

This is an example app monorepo that demonstrates how to use the different Stytch SDKs across various frameworks and implementations.

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
│   │   └── headless/          # Next.js headless implementation
│   ├── react/
│   │   ├── headless/          # React headless implementation
│   │   └── prebuilt/          # React prebuilt implementation
│   └── vanillajs/
│       ├── headless/          # Vanilla JavaScript headless implementation
│       └── prebuilt/          # Vanilla JavaScript prebuilt implementation
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

- **React Prebuilt**: Uses Stytch Prebuilt SDK with React components
- **Vanilla JavaScript Prebuilt**: Uses Stytch Prebuilt SDK with vanilla JavaScript

## Features Demonstrated

All implementations demonstrate the following Stytch B2B features:

- **Magic Link Authentication**: Email-based passwordless authentication
- **OAuth Authentication**: Google OAuth integration
- **Organization Management**: Create, list, and switch between organizations
- **Session Management**: View session tokens, JWT handling, and logout functionality
- **Error Handling**: Comprehensive error states and user feedback
- **Responsive Design**: Mobile-friendly layouts

## Quick Start

For a quick start, we recommend trying the **Vanilla JavaScript Headless** implementation as it requires minimal setup:

```bash
cd frontend/vanillajs/headless
# Add your Stytch public token to js/config.js
# Open index.html in a browser or serve with a local server
```

## Contributing

When adding new implementations or updating existing ones, please ensure:

1. **Visual Parity**: All implementations should look and behave identically
2. **Feature Parity**: All implementations should support the same features
3. **Code Quality**: Follow the existing patterns and conventions
4. **Documentation**: Update this README and package-specific READMEs

## Support

For questions about Stytch SDKs, visit our [documentation](https://stytch.com/docs) or [community forum](https://community.stytch.com/).
