# SportLens AI - High-Level Code Explanation

Let me break down how this application works at a high level:

## 🎯 **What Does This App Do?**

SportLens AI is a web application that lets users upload sports videos, analyzes them using AI, and provides professional coaching feedback. Think of it as having a personal sports coach powered by artificial intelligence.

---

## 🏗️ **Application Architecture (The Big Picture)**

```
┌─────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                        │
│                                                               │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │  VideoUpload   │→ │  Index.tsx   │→ │ AnalysisResults │ │
│  │  Component     │  │  (Main Page) │  │   Component     │ │
│  └────────────────┘  └──────────────┘  └─────────────────┘ │
│           ↓                 ↓                     ↑          │
│      Upload Video    Extract Frames         Display Results │
└─────────────────────────────────────────────────────────────┘
                              ↓
                         Send Frames
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE EDGE FUNCTION                    │
│                     (Cloud Backend)                          │
│                                                               │
│  Receives frames → Formats prompt → Calls AI Gateway        │
└─────────────────────────────────────────────────────────────┘
                              ↓
                         AI Analysis
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              LLM (AI)                   │
│                                                               │
│  Analyzes images → Identifies sport → Generates feedback    │
└─────────────────────────────────────────────────────────────┘
                              ↓
                      Returns JSON Results
                              ↓
                    Back to User's Browser
```

---

## 📦 **Main Components Explained**

### 1. **App.tsx** - The Application Shell

```
App.tsx is like the foundation of a house
├── Sets up React Router for navigation
├── Wraps everything with React Query (for data fetching)
├── Provides Toast notifications globally
└── Routes: "/" → Index page, "*" → 404 page
```

**What it does:** 
- Initializes the app
- Sets up routing so you can navigate between pages
- Provides global features like notifications to all components

---

### 2. **Index.tsx** - The Main Page (Brain of the Operation)

This is where all the magic happens. It orchestrates the entire analysis process.

**Key Responsibilities:**

#### **A. State Management**

```typescript
- selectedVideo: Stores the uploaded video file
- isAnalyzing: Shows loading state during analysis
- analysis: Stores the AI's feedback results
```

#### **B. Frame Extraction Function**

```typescript
extractFramesFromVideo(file) {
  1. Creates invisible video player
  2. Loads the video
  3. Captures 3 frames (at 20%, 40%, 60% of video)
  4. Converts frames to JPEG images (base64)
  5. Returns array of image data
}
```

**Why 3 frames?**
- Sending the entire video would be too slow and expensive
- 3 frames give the AI enough context to understand the movement
- Positioned strategically to capture beginning, middle, and end of action

#### **C. Analysis Function**

```typescript
handleAnalyze() {
  1. Extract frames from video
  2. Show "analyzing" notification
  3. Send frames to backend API
  4. Receive AI analysis
  5. Display results
  6. Handle any errors
}
```

---

### 3. **VideoUpload.tsx** - File Upload Component

```
VideoUpload Component Flow:
┌─────────────────────────────────┐
│ User clicks upload area         │
├─────────────────────────────────┤
│ File dialog opens               │
├─────────────────────────────────┤
│ User selects video              │
├─────────────────────────────────┤
│ Validation checks:              │
│  ✓ Is it a video file?         │
│  ✓ Is it under 100MB?          │
├─────────────────────────────────┤
│ Create video preview            │
├─────────────────────────────────┤
│ Show video player with controls │
├─────────────────────────────────┤
│ Enable "Analyze" button         │
└─────────────────────────────────┘
```

**Key Features:**
- Drag & drop support
- File type validation (only accepts videos)
- Size limit enforcement (100MB max)
- Video preview before analysis
- Clear/remove functionality

---

### 4. **AnalysisResults.tsx** - Results Display Component

Takes the AI's response and displays it beautifully in organized sections:

```
Analysis Display Structure:
┌───────────────────────────────────┐
│ 🏀 Sport: Basketball              │
│ Confidence: 95%                   │
├───────────────────────────────────┤
│ ✅ Technique Analysis             │
│  1. Good shooting form            │
│  2. Proper foot positioning       │
├───────────────────────────────────┤
│ ⭐ Positive Highlights            │
│  • Excellent follow-through       │
│  • Consistent arc on shot         │
├───────────────────────────────────┤
│ 📈 Improvement Suggestions        │
│  1. Bend knees more               │
│  2. Practice faster release       │
├───────────────────────────────────┤
│ ⚠️ Areas of Concern               │
│  • Landing technique needs work   │
│  • Balance during shot            │
└───────────────────────────────────┘
```

---

## 🧠 **Backend: Supabase Edge Function**

Located in: `supabase/functions/analyze-video/index.ts`

**What it does:**

```
Edge Function Flow:
┌──────────────────────────────────────┐
│ 1. Receive HTTP request with frames │
├──────────────────────────────────────┤
│ 2. Validate frames exist             │
├──────────────────────────────────────┤
│ 3. Build AI prompt:                  │
│    "You are a sports coach..."       │
│    + Instructions for JSON format    │
│    + The 3 video frames              │
├──────────────────────────────────────┤
│ 4. Send to LLM           │
│    via Lovable AI Gateway            │
├──────────────────────────────────────┤
│ 5. Handle retries (up to 3 attempts) │
├──────────────────────────────────────┤
│ 6. Parse AI response                 │
│    Extract JSON from markdown        │
├──────────────────────────────────────┤
│ 7. Return structured data to client  │
└──────────────────────────────────────┘
```

**Smart Features:**
- **Retry Logic**: If AI service fails, tries 3 times with delays
- **Error Handling**: Specific messages for rate limits, credits exhausted, etc.
- **CORS Support**: Allows browser to make requests
- **JSON Parsing**: Handles AI responses even if wrapped in markdown

---

## 🎨 **UI Components (Shadcn/ui)**

The app uses 40+ pre-built components from Shadcn/ui:

```
Button, Card, Badge, Alert, Dialog, etc.
   ↓
Built on Radix UI (accessible primitives)
   ↓
Styled with Tailwind CSS
   ↓
Beautiful, accessible, customizable
```

**Why this matters:**
- Components are accessible (keyboard navigation, screen readers)
- Consistent design system
- Fast development
- Production-ready

---

## 📱 **Mobile Support (Capacitor)**

```
Capacitor Config:
├── Takes the web app
├── Wraps it in a native mobile shell
├── Adds native capabilities:
│   ├── Camera access
│   ├── File system
│   └── Native UI elements
└── Produces iOS and Android apps
```

**Current State:**
- Camera plugin integrated (for future features)
- Configuration ready for mobile deployment
- Uses same codebase as web app

---

## 🔄 **Complete Data Flow**

Let me trace what happens when you analyze a video:

```
1. USER UPLOADS VIDEO
   ↓
   VideoUpload component receives file
   ↓
   Validates and shows preview
   ↓

2. USER CLICKS "ANALYZE"
   ↓
   handleAnalyze() starts
   ↓
   extractFramesFromVideo() runs:
     • Creates <video> element
     • Seeks to 20% timestamp → capture frame 1
     • Seeks to 40% timestamp → capture frame 2  
     • Seeks to 60% timestamp → capture frame 3
   ↓
   3 base64 JPEG images ready
   ↓

3. SEND TO BACKEND
   ↓
   POST request to Supabase Edge Function
   Body: { frames: ["data:image/jpeg...", ...] }
   ↓

4. EDGE FUNCTION PROCESSES
   ↓
   Builds prompt with coaching instructions
   ↓
   Adds frames to content array
   ↓
   Calls Lovable AI Gateway
   ↓

5. AI ANALYSIS
   ↓
   LLM receives:
     • System prompt: "You are a sports coach..."
     • User content: [text instructions + 3 images]
   ↓
   AI analyzes frames
   ↓
   Returns JSON with coaching feedback
   ↓

6. RETURN TO CLIENT
   ↓
   Edge function parses JSON
   ↓
   Returns: { analysis: {...} }
   ↓

7. DISPLAY RESULTS
   ↓
   AnalysisResults component renders:
     • Sport detection
     • Technique analysis
     • Positive highlights
     • Improvement suggestions
     • Areas of concern
```

---

## 🧩 **Key Technologies & Their Roles**

| Technology | Role | Why It's Used |
|------------|------|---------------|
| **React** | UI Framework | Component-based, fast, popular |
| **TypeScript** | Language | Catches bugs before runtime |
| **Vite** | Build Tool | Lightning-fast dev server |
| **Tailwind CSS** | Styling | Utility classes, rapid styling |
| **Supabase** | Backend | Serverless functions, easy setup |
| **AI** | Intelligence | Vision analysis, coaching insights |
| **Capacitor** | Mobile | Web → Native apps |
| **React Query** | Data Fetching | Caching, loading states |
| **React Router** | Navigation | Client-side routing |

---

## 💡 **Design Decisions Explained**

### Why Extract Frames Instead of Sending Video?

```
❌ Sending full video:
   - Large file size (slow)
   - Expensive to process
   - Requires video decoding on server

✅ Extracting 3 frames:
   - Small payload (~500KB vs 50MB)
   - Fast processing
   - Enough context for AI
   - Works in browser (HTML5 Canvas)
```

### Why Supabase Edge Functions?

```
✅ Benefits:
   - Serverless (no server management)
   - Auto-scaling (handles traffic spikes)
   - Global edge network (low latency)
   - TypeScript/Deno (modern, secure)
   - Easy deployment
```

### Why Multi-modal LLM?

```
✅ Advantages:
   - Multi-modal (text + images)
   - Fast response time
   - High-quality analysis
   - Cost-effective
   - Structured output support
```

---

## 🎯 **Summary**

**In simple terms:**

1. **User uploads a sports video** (e.g., basketball shot)
2. **Browser extracts 3 key frames** using HTML5 Canvas
3. **Frames sent to cloud backend** (Supabase Edge Function)
4. **Backend calls AI model** with coaching prompt
5. **AI analyzes technique** and returns structured feedback
6. **Results displayed beautifully** with categories and suggestions

**The entire process takes 10-20 seconds** and provides professional-grade coaching feedback that would normally require hours of video review by human coaches!

---

## 🏆 **What Makes This Architecture Great?**

### 1. **Separation of Concerns**
- Frontend handles UI and user interaction
- Backend handles AI processing
- Each layer has clear responsibilities

### 2. **Scalability**
- Serverless functions scale automatically
- No server maintenance required
- Can handle 1 user or 10,000 users

### 3. **Performance**
- Frame extraction happens client-side (uses user's CPU)
- Edge functions run close to users globally
- React Query caches results

### 4. **User Experience**
- Real-time feedback with toast notifications
- Loading states keep users informed
- Smooth animations and transitions
- Error handling with friendly messages

### 5. **Maintainability**
- TypeScript catches errors early
- Component-based architecture
- Clear file structure
- Reusable UI components

### 6. **Cross-Platform Ready**
- Same codebase for web and mobile
- Capacitor enables native features
- Responsive design works on all devices

---

## 🔍 **Code Quality Features**

### Type Safety

```typescript
// Every function knows what it expects
interface VideoUploadProps {
  onVideoSelect: (file: File) => void;
}

// AI response is typed
interface AnalysisData {
  sport: string;
  confidence: number;
  technique_analysis: string[];
  // ... etc
}
```

### Error Handling

```typescript
// Graceful error handling everywhere
try {
  const frames = await extractFramesFromVideo(selectedVideo);
  // ... analyze
} catch (error) {
  toast({
    title: "Analysis Failed",
    description: error.message,
    variant: "destructive",
  });
}
```

### Loading States

```typescript
// User always knows what's happening
const [isAnalyzing, setIsAnalyzing] = useState(false);

{isAnalyzing ? (
  <>
    <Loader2 className="animate-spin" />
    Analyzing...
  </>
) : (
  <>
    <Sparkles />
    Analyze Video
  </>
)}
```

---

## 📚 **Learning Resources**

Want to understand the technologies better?

- **React**: [react.dev](https://react.dev)
- **TypeScript**: [typescriptlang.org](https://www.typescriptlang.org)
- **Vite**: [vitejs.dev](https://vitejs.dev)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **Shadcn/ui**: [ui.shadcn.com](https://ui.shadcn.com)

---

## 🎓 **Key Concepts to Understand**

### 1. **Component Composition**
React components are like LEGO blocks - small, reusable pieces that combine to build complex UIs.

### 2. **State Management**
`useState` hooks store data that can change (like uploaded video, analysis results).

### 3. **Async/Await**
JavaScript's way of handling operations that take time (like AI analysis).

### 4. **API Integration**
Frontend calls backend with `fetch()`, backend processes and returns data.

### 5. **Serverless Functions**
Code that runs on-demand in the cloud without managing servers.

### 6. **Multi-Modal AI**
AI that can understand both text and images together.

---

## 🚀 **Future Enhancement Ideas**

Based on this architecture, you could easily add:

1. **User Accounts** - Store analysis history
2. **Real-time Video Recording** - Use device camera directly
3. **Comparison Mode** - Compare two videos side-by-side
4. **Progress Tracking** - Track improvement over time
5. **Social Features** - Share analyses with coaches
6. **Custom Prompts** - Let users customize coaching style
7. **Video Annotations** - Draw on video frames
8. **PDF Reports** - Export analyses as documents

---

This is a modern, production-ready application that combines:
- ⚛️ React frontend engineering
- 🎨 Beautiful UI/UX design
- 🤖 Advanced AI integration
- ☁️ Serverless cloud architecture
- 📱 Cross-platform capability

All working together to deliver instant sports coaching! 🏆

---

**Need more details?** Check out the main [README.md](./README.md) for setup instructions and technical specifications.

