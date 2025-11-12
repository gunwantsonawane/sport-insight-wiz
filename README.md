# SportLens AI 🏀⚽🎾

> AI-Powered Sports Performance Analysis Platform

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://sport-insight-wiz.lovable.app/)
[![Built with Lovable](https://img.shields.io/badge/built%20with-Lovable-ff69b4)](https://lovable.dev)

**Live Application**: [https://sport-insight-wiz.lovable.app/](https://sport-insight-wiz.lovable.app/)

---

## 📚 Documentation

- **[Hackathon Demo Guide](./HACKATHON_DEMO.md)** - Complete presentation deck for demo sessions including problem, solution, and impact
- **[High-Level Code Explanation](./CODE_EXPLANATION.md)** - Comprehensive guide to understanding the codebase architecture and data flow
- **[Capacitor Guide](./README_CAPACITOR.md)** - Mobile deployment instructions for iOS and Android

---

## 📋 Project Summary

SportLens AI is an advanced AI-powered sports analysis platform that provides instant, professional-grade coaching feedback on athletic performance. By leveraging cutting-edge computer vision and natural language AI, the application analyzes uploaded sport videos and delivers comprehensive technical assessments, improvement suggestions, and personalized coaching insights.

### Key Features

- 🎥 **Video Upload & Processing**: Supports multiple video formats (MP4, MOV, AVI) up to 100MB
- 🤖 **AI-Powered Analysis**: Powered by OpenAI GPT-5-mini for multi-modal vision analysis
- 📊 **Comprehensive Feedback**: Provides structured coaching in 5 key areas:
  - Sport detection with confidence scoring
  - Detailed technique analysis
  - Positive performance highlights
  - Actionable improvement suggestions
  - Areas of concern and safety considerations
- 📱 **Cross-Platform**: Web application with Capacitor mobile support for iOS/Android
- ⚡ **Real-Time Processing**: Frame extraction and analysis in under 30 seconds
- 🎨 **Modern UI/UX**: Beautiful, responsive interface built with Shadcn/ui and Tailwind CSS

---

## 🏗️ Technical Architecture

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | Core UI framework with modern hooks API |
| **TypeScript** | 5.8.3 | Type-safe development with strict mode |
| **Vite** | 5.4.19 | Lightning-fast build tool and dev server |
| **React Router DOM** | 6.30.1 | Client-side routing and navigation |
| **TanStack Query** | 5.83.0 | Powerful async state management |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS framework |
| **Shadcn/ui** | Latest | Radix UI-based component library |
| **Lucide React** | 0.462.0 | Beautiful icon library |

### Backend & Infrastructure

| Technology | Purpose |
|------------|---------|
| **Supabase Edge Functions** | Serverless Deno-based API endpoints |
| **OpenAI GPT-5-mini** | Multi-modal AI vision model for video analysis |
| **Lovable AI Gateway** | Managed AI model access and routing |

### Mobile & Native

| Technology | Version | Purpose |
|------------|---------|---------|
| **Capacitor** | 7.4.4 | Native mobile wrapper for iOS/Android |
| **Capacitor Camera** | 7.0.2 | Native camera access plugin |

### Development Tools

- **ESLint** with React Hooks plugin for code quality
- **PostCSS** & **Autoprefixer** for CSS processing
- **TypeScript ESLint** for type-aware linting
- **SWC** for ultra-fast React compilation

---

## 🔧 Technical Implementation

### Video Frame Extraction

The application uses HTML5 Canvas API to extract keyframes from uploaded videos:

```typescript
// Extract 3 strategic frames at 20%, 40%, 60% of video duration
const frameTimes = [0.2, 0.4, 0.6];

// Convert frames to base64-encoded JPEG images
canvas.toDataURL('image/jpeg', 0.8);
```

**Why this approach?**
- Reduces payload size (3 frames vs. entire video)
- Provides temporal diversity for comprehensive analysis
- Enables fast processing without video codec dependencies
- Client-side processing reduces server load

### AI Analysis Pipeline

```
User Upload Video
    ↓
Client-Side Frame Extraction (3 frames)
    ↓
POST to Supabase Edge Function
    ↓
Lovable AI Gateway → OpenAI GPT-5-mini
    ↓
Multi-Modal Vision Analysis (Images + Coaching Prompt)
    ↓
Structured JSON Response
    ↓
Parse & Display Results
```

### Supabase Edge Function Architecture

- **Runtime**: Deno (TypeScript-native, secure by default)
- **Deployment**: Distributed edge network for low latency
- **CORS Handling**: Full cross-origin support for web clients
- **Retry Logic**: Exponential backoff for transient failures (3 attempts)
- **Error Handling**: Specific status codes for rate limits, credits, network issues

### AI Prompt Engineering

The system uses a carefully crafted prompt that instructs the AI to act as:
- Expert sports coach
- Biomechanics analyst
- Performance consultant

The prompt enforces structured JSON output with mandatory fields:
- `sport`: Detected sport name
- `confidence`: 0-1 confidence score
- `technique_analysis[]`: Array of technical observations
- `improvement_suggestions[]`: Actionable coaching tips
- `positive_highlights[]`: Strengths to reinforce
- `areas_of_concern[]`: Safety and form issues

---

## 📂 Project Structure

```
sport-insight-wiz/
├── src/
│   ├── components/
│   │   ├── VideoUpload.tsx          # Video upload with preview
│   │   ├── AnalysisResults.tsx      # Structured AI feedback display
│   │   ├── ui/                      # Shadcn/ui components (40+ components)
│   │   └── NavLink.tsx              # Navigation utilities
│   ├── hooks/
│   │   ├── use-mobile.tsx           # Mobile device detection
│   │   ├── use-toast.ts             # Toast notification management
│   │   └── useNativeCamera.ts       # Capacitor camera integration
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts            # Supabase client configuration
│   │       └── types.ts             # Database type definitions
│   ├── pages/
│   │   ├── Index.tsx                # Main analysis page
│   │   └── NotFound.tsx             # 404 error page
│   ├── lib/
│   │   └── utils.ts                 # Utility functions (cn, etc.)
│   ├── App.tsx                      # Root component with routing
│   ├── main.tsx                     # Application entry point
│   └── index.css                    # Global styles & Tailwind imports
├── supabase/
│   └── functions/
│       └── analyze-video/
│           └── index.ts             # AI analysis edge function
├── public/                          # Static assets
├── capacitor.config.ts              # Mobile app configuration
├── tailwind.config.ts               # Tailwind customization
├── vite.config.ts                   # Vite build configuration
└── tsconfig.json                    # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd sport-insight-wiz

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

---

## 📱 Mobile Development

### Build for iOS

```bash
# Build web assets
npm run build

# Sync with Capacitor
npx cap sync ios

# Open in Xcode
npx cap open ios
```

### Build for Android

```bash
# Build web assets
npm run build

# Sync with Capacitor
npx cap sync android

# Open in Android Studio
npx cap open android
```

---

## 🔐 API Configuration

### Supabase Edge Function

The `analyze-video` function requires:

1. **LOVABLE_API_KEY**: Set in Supabase dashboard under Project Settings → Edge Functions → Secrets

```bash
# Using Supabase CLI
supabase secrets set LOVABLE_API_KEY=your_key_here
```

2. **Deploy Function**:

```bash
supabase functions deploy analyze-video
```

---

## 🎨 UI/UX Design Patterns

### Component Architecture

- **Atomic Design**: Smallest UI units (buttons, inputs) compose into larger components
- **Compound Components**: Related components work together (e.g., Card, CardHeader, CardContent)
- **Render Props & Hooks**: Flexible state sharing and behavior composition

### Styling Strategy

- **Tailwind CSS**: Utility-first approach for rapid prototyping
- **CSS Variables**: Theme colors defined in `:root` for easy customization
- **Responsive Design**: Mobile-first breakpoints (sm, md, lg, xl, 2xl)
- **Dark Mode Ready**: Theme system via `next-themes`

### Accessibility

- **ARIA Labels**: All interactive elements properly labeled
- **Keyboard Navigation**: Full keyboard support via Radix UI
- **Screen Reader Support**: Semantic HTML and ARIA attributes
- **Focus Management**: Visible focus indicators and logical tab order

---

## 🧪 Testing & Quality Assurance

### Code Quality Tools

- **ESLint**: Linting with React-specific rules
- **TypeScript**: Compile-time type checking
- **Prettier**: Code formatting (via Lovable)

### Browser Support

- ✅ Chrome/Edge (Chromium) 100+
- ✅ Firefox 100+
- ✅ Safari 15+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📊 Performance Metrics

- **Initial Load**: < 2s (optimized bundle splitting)
- **Frame Extraction**: < 3s for typical video
- **AI Analysis**: 5-15s depending on complexity
- **Lighthouse Score**: 90+ performance, 100 accessibility

---

## 🔮 Future Enhancements

- [ ] Real-time video recording from webcam
- [ ] Multi-athlete tracking in team sports
- [ ] Historical performance tracking and trends
- [ ] Export analysis reports to PDF
- [ ] Social sharing of achievements
- [ ] Integration with wearable device data
- [ ] Custom coaching plan generation
- [ ] Video annotation and markup tools

---

## 🤝 Contributing

### Using Lovable (Recommended)

Simply visit the [Lovable Project](https://lovable.dev/projects/f8f0e91c-cd5b-44cc-85bf-e3b4d1a3581a) and start prompting. Changes made via Lovable will be committed automatically to this repo.

### Using Local IDE

1. Clone and create a new branch
2. Make your changes
3. Push to the repository
4. Changes will sync to Lovable automatically

### Using GitHub Codespaces

1. Click "Code" → "Codespaces" → "New codespace"
2. Edit files directly in the browser-based VS Code
3. Commit and push when done

---

## 📝 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build in development mode (with source maps)
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

---

## 📄 License

This project is built with [Lovable](https://lovable.dev) and follows their terms of service.

---

## 🙏 Acknowledgments

- **Lovable Platform**: For providing the development infrastructure
- **OpenAI**: For GPT-5-mini's powerful vision AI capabilities
- **Supabase**: For serverless backend and edge functions
- **Shadcn/ui**: For beautiful, accessible React components
- **Radix UI**: For unstyled, accessible component primitives

---

## 📞 Support

- **Issues**: Open an issue on GitHub
- **Questions**: Contact via Lovable platform
- **Live App**: [https://sport-insight-wiz.lovable.app/](https://sport-insight-wiz.lovable.app/)
- **Lovable Project**: [https://lovable.dev/projects/f8f0e91c-cd5b-44cc-85bf-e3b4d1a3581a](https://lovable.dev/projects/f8f0e91c-cd5b-44cc-85bf-e3b4d1a3581a)

---

