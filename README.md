# HTML to Skeleton Generator

A modern web application that automatically generates loading skeleton components from HTML markup. Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- 🎨 **Two-Panel Interface**: Clean split view with HTML input on the left and generated skeleton code on the right
- 🔍 **Intelligent Analysis**: Automatically detects elements (text, images, buttons, inputs) and their dimensions
- 👁️ **Live Preview**: See the generated skeleton component rendered in real-time
- 📋 **Copy to Clipboard**: One-click copying of generated code
- 💅 **shadcn/ui Components**: Uses production-ready Skeleton components
- 🎯 **Tailwind Support**: Fully analyzes Tailwind classes and generates appropriate skeleton layouts
- ⚡ **Fast & Accurate**: Uses hidden iframe rendering to calculate precise element bounds
- 🚀 **Production Ready**: Type-safe, linted, and optimized build

## How It Works

1. **Paste HTML**: Input your HTML markup in the left panel
2. **Analyze**: Click "Generate Skeleton" to analyze the HTML structure
3. **Preview**: View the generated skeleton component in the preview panel
4. **Copy**: Copy the generated React/TypeScript code to use in your project

The analyzer works by:
- Parsing your HTML with DOMParser
- Rendering it in a hidden iframe with Tailwind CDN
- Traversing the DOM to identify leaf elements (text, images, buttons)
- Calculating element positions and dimensions using getBoundingClientRect
- Generating optimized skeleton code using shadcn/ui Skeleton components

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Linting**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/madushan-sooriyarathne/html-skeleton-generator.git
cd html-skeleton-generator

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## Project Structure

```
html-skeleton-generator/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx             # Main application page
│   ├── components/
│   │   └── ui/                  # shadcn/ui components
│   │       ├── skeleton.tsx
│   │       ├── button.tsx
│   │       └── textarea.tsx
│   ├── lib/
│   │   ├── skeleton-generator.ts # Core analyzer logic
│   │   └── utils.ts              # Utility functions
│   └── styles/
│       └── globals.css           # Global styles
├── public/                       # Static assets
├── components.json               # shadcn/ui configuration
└── package.json
```

## Usage Example

### Input HTML:
```html
<div class="max-w-sm mx-auto bg-white rounded-lg shadow-md p-6">
  <div class="flex items-center space-x-4">
    <img src="avatar.jpg" class="w-16 h-16 rounded-full" />
    <div>
      <h2 class="text-xl font-bold">John Doe</h2>
      <p class="text-gray-600">Software Engineer</p>
    </div>
  </div>
  <p class="mt-4">Lorem ipsum dolor sit amet...</p>
  <button class="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md">
    View Profile
  </button>
</div>
```

### Generated Skeleton:
```tsx
import { Skeleton } from "~/components/ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <Skeleton className="rounded-full h-16 w-16" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="rounded-md h-10 w-full" />
    </div>
  );
}
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Configuration

### shadcn/ui

The project uses shadcn/ui with the following configuration:

- **Style**: Default
- **Base Color**: Slate
- **CSS Variables**: Yes
- **Import Alias**: `~/components`

To add more shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

## License

MIT

## Author

**Madushan Sooriyarathne** ([@madushan-sooriyarathne](https://github.com/madushan-sooriyarathne))

---

Built with ❤️ using Next.js and shadcn/ui
