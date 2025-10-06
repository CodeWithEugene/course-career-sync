# SkillSync - Coursework to Career Skills Mapping Platform

![SkillSync Logo](https://img.shields.io/badge/SkillSync-AI%20Powered-blue?style=for-the-badge&logo=sparkles)

**Transform your academic coursework into industry-recognized skills and build a verified portfolio that matches your dream career.**

## 🚀 Overview

SkillSync is an AI-powered web application that analyzes your academic coursework (syllabi, notes, assignments) and maps them to real-world industry skills. It helps students and professionals understand how their educational achievements translate into career opportunities by providing:

- **AI-powered skill extraction** from coursework content
- **Career path matching** with percentage fit analysis
- **Verified skill badges** representing your competencies
- **Shareable skill portfolios** for employers and universities
- **Personalized recommendations** for skill development

## ✨ Key Features

### 🎯 Core Functionality
- **Smart Coursework Analysis**: Upload or paste your course materials for AI analysis
- **Career Path Mapping**: Choose from 8+ predefined career paths (Data Scientist, Software Engineer, UX Designer, etc.)
- **Skill Badge Generation**: Receive verified badges with confidence scores
- **Portfolio Creation**: Generate shareable skill portfolios
- **Progress Tracking**: Monitor your skill development over time

### 🎨 User Experience
- **Modern UI/UX**: Built with React, TypeScript, and Tailwind CSS
- **Dark/Light Theme**: Automatic theme switching with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Real-time Feedback**: Toast notifications and loading states

### 🔐 Security & Authentication
- **Supabase Authentication**: Secure user registration and login
- **Row Level Security (RLS)**: Database-level security policies
- **Protected Routes**: Authentication-based route protection
- **Session Management**: Persistent user sessions with auto-refresh

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### Backend & Database
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Relational database with JSON support
- **Supabase Edge Functions** - Serverless functions for AI processing
- **Row Level Security** - Database-level access control

### AI & Processing
- **Lovable AI Gateway** - AI model integration
- **Google Gemini 2.5 Flash** - Large language model for content analysis
- **Custom AI Prompts** - Structured skill extraction and career matching

### Development Tools
- **ESLint** - Code linting and formatting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
course-career-sync/
├── public/                     # Static assets
│   ├── favicon.ico
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── Hero.tsx          # Landing page hero section
│   │   ├── Features.tsx      # Features showcase
│   │   ├── ThemeProvider.tsx # Theme context provider
│   │   └── ThemeToggle.tsx   # Dark/light mode toggle
│   ├── hooks/                # Custom React hooks
│   │   ├── use-mobile.tsx    # Mobile detection hook
│   │   └── use-toast.ts      # Toast notification hook
│   ├── integrations/         # External service integrations
│   │   └── supabase/         # Supabase client and types
│   ├── lib/                  # Utility functions
│   │   └── utils.ts          # Common utilities
│   ├── pages/                # Application pages
│   │   ├── Index.tsx         # Landing page
│   │   ├── Auth.tsx          # Authentication page
│   │   ├── Dashboard.tsx     # Main dashboard
│   │   ├── Profile.tsx       # User profile and portfolio
│   │   └── NotFound.tsx      # 404 error page
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles
├── supabase/
│   ├── functions/            # Edge functions
│   │   └── analyze-coursework/ # AI analysis function
│   ├── migrations/           # Database migrations
│   └── config.toml           # Supabase configuration
├── package.json              # Dependencies and scripts
├── vite.config.ts            # Vite configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Supabase account** for backend services
- **Lovable AI API key** for AI processing

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/course-career-sync.git
   cd course-career-sync
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   LOVABLE_API_KEY=your_lovable_api_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations:
     ```bash
     npx supabase db reset
     ```
   - Deploy the edge function:
     ```bash
     npx supabase functions deploy analyze-coursework
     ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:8080`

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel** (recommended)
   ```bash
   npx vercel --prod
   ```

3. **Configure environment variables** in your deployment platform

## 🗄️ Database Schema

### Tables

#### `profiles`
Stores user profile information
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to auth.users)
- email: TEXT
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

#### `skill_analyses`
Stores AI analysis results
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to auth.users)
- career_path: TEXT
- coursework_content: TEXT
- skills: JSONB (Array of skill objects)
- career_match: JSONB (Career matching data)
- created_at: TIMESTAMPTZ
```

### Security Policies

- **Row Level Security (RLS)** enabled on all tables
- **User isolation**: Users can only access their own data
- **Automatic profile creation**: Profiles created on user registration

## 🤖 AI Integration

### Analysis Process

1. **Content Processing**: User uploads or pastes coursework content
2. **AI Analysis**: Content sent to Google Gemini 2.5 Flash model
3. **Skill Extraction**: AI identifies skills with confidence scores
4. **Career Matching**: Skills compared against career requirements
5. **Result Generation**: Structured JSON response with recommendations

### AI Prompt Structure

The system uses carefully crafted prompts to ensure consistent, structured output:

```typescript
{
  "skills": [
    {
      "name": "Skill name",
      "confidence": 0.85,
      "category": "Technical|Soft Skills|Professional",
      "relatedCourses": ["Course name"]
    }
  ],
  "careerMatch": {
    "career": "Career path name",
    "matchedSkills": ["Skill 1", "Skill 2"],
    "percentageFit": 85,
    "missingSkills": ["Skill A", "Skill B"],
    "recommendations": "Brief recommendation"
  }
}
```

## 🎨 UI Components

Built with **shadcn/ui** components for consistency and accessibility:

- **Form Components**: Input, Textarea, Select, Button
- **Layout Components**: Card, Sheet, Dialog, Tabs
- **Feedback Components**: Toast, Alert, Progress
- **Navigation Components**: Breadcrumb, Navigation Menu
- **Data Display**: Table, Badge, Avatar, Chart

## 🔧 Configuration

### Vite Configuration
- **Path aliases**: `@` points to `src/` directory
- **Development server**: Runs on port 8080 with polling
- **Component tagging**: Development-only component identification

### Tailwind Configuration
- **Custom color scheme**: CSS variables for theme switching
- **Extended animations**: Accordion and custom keyframes
- **Responsive breakpoints**: Mobile-first design approach

### TypeScript Configuration
- **Strict mode**: Enabled for better type safety
- **Path mapping**: Consistent import paths
- **Modern target**: ES2020 for optimal performance

## 📱 Responsive Design

- **Mobile-first approach**: Optimized for mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1400px)
- **Touch-friendly**: Large tap targets and intuitive gestures
- **Progressive enhancement**: Core functionality works without JavaScript

## 🔒 Security Features

- **Authentication**: Supabase Auth with email/password
- **Authorization**: Row Level Security policies
- **Input validation**: Client and server-side validation
- **CORS protection**: Configured for production domains
- **Rate limiting**: AI API rate limiting and error handling

## 🚀 Performance Optimizations

- **Code splitting**: Route-based code splitting with React.lazy
- **Image optimization**: Optimized assets and lazy loading
- **Bundle analysis**: Vite bundle analyzer for size optimization
- **Caching**: Supabase client caching and React Query
- **Animations**: Hardware-accelerated Framer Motion animations

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Coursework upload and analysis
- [ ] Career path selection
- [ ] Skill portfolio generation
- [ ] Profile sharing functionality
- [ ] Theme switching
- [ ] Responsive design on different devices

### Error Handling
- **Network errors**: Graceful fallbacks and retry mechanisms
- **AI service errors**: User-friendly error messages
- **Authentication errors**: Clear feedback and recovery options
- **Validation errors**: Real-time form validation

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Write descriptive component names
- Maintain consistent code formatting
- Test on multiple devices and browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for the backend infrastructure
- **Lovable** for AI model integration
- **shadcn/ui** for the component library
- **Vercel** for deployment platform
- **OpenAI/Google** for AI models

## 📞 Support

For support, email support@skillsync.app or join our Discord community.

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Basic coursework analysis
- ✅ Career path matching
- ✅ Skill portfolio generation

### Phase 2 (Planned)
- [ ] Advanced skill categories
- [ ] Industry-specific templates
- [ ] Integration with learning management systems
- [ ] Batch analysis for multiple courses

### Phase 3 (Future)
- [ ] AI-powered career recommendations
- [ ] Skill gap analysis
- [ ] Learning path suggestions
- [ ] Employer dashboard
- [ ] API for third-party integrations

---

**Built with ❤️ for students and professionals worldwide**
