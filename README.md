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
   ```

2. **Follow the instructions in that package's README** for setup and running instructions specific to that implementation.

## Repository Structure

```bash
stytch-all-examples/
├── frontend/
│ ├── nextjs/headless/ # Next.js headless implementation
│ └── react/headless/ # React headless implementation
└── internal/ # Shared components and utilities
```
