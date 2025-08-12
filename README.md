# ThySpace - Location-Based Social Platform

ThySpace is a modern, location-based social platform where users can explore, share, and connect with the world around them. Built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

### Landing Page (`/`)
- **Modern Design**: Beautiful, responsive landing page with animated backgrounds
- **Clear Value Proposition**: Explains the platform's benefits and features
- **Call-to-Action**: Direct paths to sign up or log in
- **Home Page**: Serves as the main entry point for all users

### Authentication System
- **Google OAuth**: One-click sign-in with Google accounts
- **User Registration**: Complete signup flow with validation
- **User Login**: Secure authentication system with multiple options
- **Form Validation**: Client-side validation with error handling
- **Session Management**: Secure session handling with NextAuth.js

### Main Application (`/here`)
- **Authenticated User Experience**: This is what users see after signing in
- **Modern Dashboard**: Clean, modern interface with navigation tabs
- **Location Management**: Set and manage your current location
- **Content Sharing**: Post photos, videos, and stories tied to locations
- **Virtual Land Ownership**: Purchase and control virtual locations
- **User Profiles**: Track your progress, XP, and achievements

### Feature Marketplace
- **Pre-built Features**: Three initial features available for purchase:
  - 🎵 **Start a Playlist**: Create and manage music playlists (25 coins)
  - 📋 **Create Rules List**: Set community guidelines (15 coins)
  - 🎫 **Sell Tickets**: Event ticketing and booking management (35 coins)
- **Custom Feature Requests**: Suggest new features for builders to implement
- **Builder System**: Users can declare themselves as builders to receive feature requests
- **Purchase Modals**: Interactive purchase confirmation with coin balance display

### Core Functionality
- **Geolocation Support**: Automatic location detection with manual fallback
- **Content Discovery**: Explore content within a 2km radius
- **Community Features**: Connect with nearby users and events
- **Gamification**: Level up system with XP and coins
- **Builder Economy**: Community-driven feature development

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Shadcn/ui component library
- **Icons**: Lucide React icons
- **State Management**: React hooks and context
- **Routing**: Next.js App Router
- **Authentication**: NextAuth.js with Google OAuth
- **Session Management**: NextAuth.js session handling

## 📁 Project Structure

```
thyspace2/
├── app/                          # Next.js app directory
│   ├── api/                     # API routes
│   │   └── auth/               # NextAuth.js authentication
│   ├── components/              # React components
│   ├── hooks/                   # Custom React hooks
│   ├── landing/                 # Landing page (home)
│   ├── login/                   # Login page
│   ├── signup/                  # Signup page
│   ├── here/                    # Main dashboard
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Redirect to landing
├── components/                   # Shared UI components
│   ├── ui/                      # Shadcn/ui components
│   ├── theme-provider.tsx       # Theme management
│   └── session-provider.tsx     # NextAuth session provider
├── lib/                         # Utility functions
├── public/                      # Static assets
└── styles/                      # Additional styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Google OAuth credentials (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd thyspace2
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your Google OAuth credentials:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   NEXTAUTH_SECRET=your_nextauth_secret_here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Get Google OAuth credentials**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
   - Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### For New Users
1. Visit the landing page at `/` (or `/landing`)
2. Click "Start Exploring Free" to create an account
3. Choose Google OAuth or fill out the registration form
4. Start exploring the platform!

### For Existing Users
1. Visit the login page at `/login`
2. Use Google OAuth or enter your credentials
3. Access your personalized dashboard at `/here`

### Main App Features
- **Map Tab**: View your location and explore nearby content
- **Profile Tab**: Check your stats, level, and achievements
  - **Builder Mode**: Toggle to become a builder and receive feature requests
- **Events Tab**: Create and join location-based events
- **Rules Tab**: View platform guidelines and policies
- **Leaderboard Tab**: See top users and rankings

### Feature Marketplace
- **Purchase Features**: Buy pre-built features with coins
- **Request Custom Features**: Submit feature requests for builders
- **Builder Dashboard**: View and claim feature requests (if builder mode is active)

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Theme Configuration
The app uses a dark theme by default. You can modify the theme in `components/theme-provider.tsx`.

## 🎨 Customization

### Styling
- **Colors**: Modify the color scheme in `tailwind.config.js`
- **Components**: Customize UI components in `components/ui/`
- **Layouts**: Adjust page layouts in the `app/` directory

### Features
- **Authentication**: Google OAuth is already implemented
- **Feature Marketplace**: Add new pre-built features in `app/components/FeatureMarketplace.tsx`
- **API Integration**: Connect to your backend services in `app/api/`
- **Database**: Add database integration for user data and content

## 🚧 Development Status

### ✅ Completed
- Landing page as home page (`/`)
- Google OAuth authentication
- User authentication flows
- Main application dashboard (`/here`)
- Feature marketplace with three initial features
- Builder system for custom feature requests
- Purchase modals and coin system
- Responsive design and mobile support
- Theme system and dark mode
- Basic location management
- Content posting interface
- Session management with NextAuth.js

### 🚧 In Progress
- Interactive map integration
- Real-time content updates
- User profile management
- Event creation and management

### 📋 Planned
- Real database integration
- File upload system
- Push notifications
- Mobile app
- Advanced gamification features
- Builder marketplace
- Feature implementation tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Authentication with [NextAuth.js](https://next-auth.js.org/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For support, email support@thyspace.com or create an issue in this repository.

---

**ThySpace** - Discover your world, one location at a time. 🌍📍 