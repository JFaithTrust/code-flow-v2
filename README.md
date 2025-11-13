# CodeFlow

![CodeFlow identity](public/images/site-logo.svg)

CodeFlow is a modern, community-driven Q&A platform for developers. Collaborate on real-world questions, share knowledge-rich answers, and keep track of the technologies that matter to you.

> Tip: replace the logo above with a full-page screenshot (`docs/preview.png`) once you have one handy.

## 🌐 Demo

- Live preview (coming soon)
- Local development: http://localhost:3000

## 📝 Description

- **Motivation:** Provide a polished alternative to legacy Q&A platforms with first-class dark mode and performance-friendly UX.
- **What it solves:** Helps engineers ask, discover, and curate programming answers with rich filtering, bookmarking, and activity tracking.
- **What we learned:** Practical server actions, streaming AI responses, and secure authentication in Next.js 16 with React 19.
- **Project status:** Actively evolving; see the roadmap below to track upcoming improvements.

## 📖 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Usage](#-usage)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Credits](#-credits)
- [Contact](#-contact)
- [License](#-license)

## 🧠 Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack) + React 19
- **Styling:** Tailwind CSS v4, CSS custom properties, responsive design tokens
- **Database:** MongoDB with Mongoose models and connection caching
- **Auth:** NextAuth (credentials, Google, GitHub providers)
- **AI:** Google Gemini models via `@ai-sdk/google`
- **Tooling:** TypeScript, ESLint 9, shadcn/ui primitives, Radix UI, MDX Editor

## ✨ Features

- End-to-end question and answer workflow with tagging, voting, and bookmarking
- Global search with debounced filters and contextual result cards
- AI-assisted answer suggestions that stay succinct and Markdown-friendly
- Responsive dashboards, sidebars, and dark mode persistence with `next-themes`
- Social authentication for GitHub and Google, plus secure credential logins
- Reusable server actions with granular validation and error handling

## 🗂️ Project Structure

```text
app/
	(root)/          // Authenticated shell with nav, feed, and sidebars
	(auth)/          // Auth pages and marketing shell
	api/             // REST endpoints for auth, AI, users, accounts, jobs
components/
	cards/           // Question, answer, job, tag and user cards
	forms/           // Authentication and content forms
	shared/          // Filters, search, pagination, UI helpers
	ui/              // shadcn/ui wrappers (buttons, inputs, dialogs)
constants/         // Routes, filters, interaction states
database/          // Mongoose models and relations
lib/               // Utilities, server actions, HTTP handlers, logging
public/            // Static assets and icons
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 20.11 or newer (LTS recommended)
- npm (comes with Node.js) or pnpm if you prefer
- MongoDB 7+ (Atlas or local instance)
- RapidAPI key (optional, unlocks the job search module)
- Google Generative AI API key (optional, for AI answers)
- Git for version control

### Quick Start

```bash
# Clone the repository
git clone https://github.com/JFaithTrust/code-flow-v2.git
cd code-flow-v2

# Install dependencies
npm install

# Copy environment template and set secrets
cp .env.example .env.local   # create this file if it does not exist yet

# Run the development server
npm run dev

# Visit the app
open http://localhost:3000
```

## 🔒 Environment Variables

Create an `.env.local` file in the project root and provide the values that apply to your setup.

| Variable                       | Required         | Default                     | Description                                                              |
| ------------------------------ | ---------------- | --------------------------- | ------------------------------------------------------------------------ |
| `NEXT_PUBLIC_BASE_URL`         | No               | `http://localhost:3000/api` | Base URL for server actions that call internal APIs                      |
| `NEXT_PUBLIC_MONGODB_URI`      | Yes              | None                        | MongoDB connection string (include database name or use `dbName` option) |
| `NEXTAUTH_SECRET`              | Yes              | None                        | Secret used by NextAuth to encrypt session JWTs                          |
| `NEXTAUTH_URL`                 | Yes (prod)       | `http://localhost:3000`     | Public URL of your app for NextAuth callbacks                            |
| `GITHUB_ID`                    | For GitHub OAuth | None                        | GitHub OAuth client ID                                                   |
| `GITHUB_SECRET`                | For GitHub OAuth | None                        | GitHub OAuth client secret                                               |
| `GOOGLE_CLIENT_ID`             | For Google OAuth | None                        | Google OAuth client ID                                                   |
| `GOOGLE_CLIENT_SECRET`         | For Google OAuth | None                        | Google OAuth client secret                                               |
| `GOOGLE_GENERATIVE_AI_API_KEY` | For AI answers   | None                        | API key used by `@ai-sdk/google` to call Gemini                          |
| `NEXT_PUBLIC_RAPID_API_KEY`    | Optional         | None                        | Enables job search results via the RapidAPI JSearch endpoint             |
| `LOG_LEVEL`                    | No               | `info`                      | Pino logger verbosity (`debug`, `info`, `warn`, `error`)                 |

> Need more variables? Search for `process.env` in the codebase; every usage is documented inline.

## 🚀 Available Scripts

| Script          | Description                                         |
| --------------- | --------------------------------------------------- |
| `npm run dev`   | Start the Next.js development server with Turbopack |
| `npm run build` | Create an optimized production build                |
| `npm run start` | Run the compiled app in production mode             |
| `npm run lint`  | Lint the project with ESLint                        |

## 🔍 Usage

Once the server is running at `http://localhost:3000` you can:

1. Sign up or sign in with email, Google, or GitHub.
2. Create questions, attach tags, and preview content using the MDX editor.
3. Submit answers, upvote, bookmark, and follow recommendations tailored to your activity.
4. Experiment with the AI helper to draft concise solutions (requires the Gemini API key).
5. Explore the job search tab to fetch openings powered by RapidAPI.

## ✅ Roadmap

- [ ] Finish production-ready deployment guide (Vercel + MongoDB Atlas)
- [ ] Add integration tests for server actions
- [ ] Ship notification center for interactions and badge system
- [x] Support GitHub and Google OAuth
- [x] Introduce AI-assisted answer generation

## 🤝 Contributing

Contributions are welcome! If you plan to submit a pull request:

1. Fork the repository and create a feature branch (`git checkout -b feat/amazing-idea`).
2. Make your changes with tests or Storybook examples where possible.
3. Run `npm run lint` before pushing.
4. Open a pull request describing the motivation and screenshots or recordings if UI changes are involved.

If you find a bug or want to request a feature, please open an issue and include reproduction steps or mockups.

## 🙌 Credits

- Built by [Jahongir Solijoniy](https://github.com/JFaithTrust) and collaborators.
- UI primitives powered by [shadcn/ui](https://ui.shadcn.com) and [Radix UI](https://www.radix-ui.com).
- Rich text editing courtesy of [@mdxeditor/editor](https://mdxeditor.dev).

If you contributed to this project, feel free to add yourself to this list in a follow-up PR.

## 📞 Contact

- LinkedIn: [JavaScript Mastery](https://www.linkedin.com/in/jahongir-solijoniy-2a5722293)
- Email: jahongirsolijoniy@gmail.com

Want notifications about new features? Watch the repository or join the discussion tab.

## 📄 License

License details are being finalized. Until a dedicated `LICENSE` file is added, all rights are reserved by the project authors. Reach out if you need a custom license agreement.
