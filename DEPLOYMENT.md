# ThySpace Deployment Guide

## 🚀 GitHub Repository Setup

### 1. Repository Creation
The repository has been created at: `https://github.com/OllaCart-Org/thyspace`

### 2. Initial Setup
```bash
# Clone the repository
git clone https://github.com/OllaCart-Org/thyspace.git
cd thyspace

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
```

### 3. Environment Variables
Edit `.env.local` with your credentials:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://your-domain.vercel.app

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 🔐 Google OAuth Setup

### 1. Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs

### 2. OAuth Configuration
- **Application type**: Web application
- **Authorized redirect URIs**: 
  - `https://your-domain.vercel.app/api/auth/callback/google`
  - `http://localhost:3000/api/auth/callback/google` (for development)

### 3. Get Credentials
- Copy the Client ID and Client Secret
- Add them to your `.env.local` file

## 🚀 Vercel Deployment

### 1. Connect to Vercel
1. Go to [Vercel](https://vercel.com/)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import the `ollacart-org/thyspace` repository

### 2. Project Configuration
- **Framework Preset**: Next.js
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)

### 3. Environment Variables in Vercel
Add the same environment variables from `.env.local`:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 4. Deploy
Click "Deploy" and wait for the build to complete.

## 🔒 Ring Signature Crypto System

### 1. Frontend Encryption
The app uses ring signatures to encrypt location data:
- **Location Privacy**: Users can choose public, private, or encrypted posting
- **Ring Signatures**: Hides the actual signer among multiple public keys
- **Device Fingerprinting**: Includes device-specific identifiers for enhanced privacy

### 2. Backend API
- **Endpoint**: `/api/crypto/ring-signature`
- **Actions**: encrypt, verify, decrypt, generate-keys, add-noise, hash-location
- **Security**: No-cache headers for crypto operations

### 3. iOS Optimizations
- **Media Handling**: Optimized for mobile photo/video uploads
- **Location Compression**: Reduces coordinate precision for mobile efficiency
- **Privacy Controls**: Three levels of location privacy
- **Device Fingerprinting**: Unique device identification for privacy

## 📱 iOS-Specific Features

### 1. Mobile Optimization
- **Responsive Design**: Touch-friendly interface
- **File Size Limits**: 10MB per file, max 5 files
- **Media Support**: Images and videos
- **Progressive Enhancement**: Works on all devices

### 2. Location Privacy
- **Public**: Exact coordinates visible
- **Private**: Coordinates with differential privacy noise
- **Encrypted**: Ring signature encryption with hidden coordinates

### 3. Performance Features
- **Lazy Loading**: Media previews load on demand
- **Compression**: Location data optimized for mobile transmission
- **Caching**: Efficient data handling for mobile networks

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run type checking
npm run type-check
```

## 🔧 Customization

### 1. Ring Signature Parameters
Edit `lib/crypto.ts`:
```typescript
private static readonly KEY_SIZE = 256        // Key size in bits
private static readonly RING_SIZE = 5         // Number of ring participants
```

### 2. Privacy Levels
Modify `app/components/IOSLocationPost.tsx`:
```typescript
const [privacyLevel, setPrivacyLevel] = useState<'public' | 'private' | 'encrypted'>('encrypted')
```

### 3. Media Limits
Adjust file size and count limits:
```typescript
const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit
setMediaFiles(prev => [...prev, ...validFiles].slice(0, 5)) // Max 5 files
```

## 🚨 Security Considerations

### 1. Environment Variables
- Never commit `.env.local` to version control
- Use Vercel's environment variable system for production
- Rotate secrets regularly

### 2. Crypto Implementation
- The current implementation is for demonstration
- For production, use established crypto libraries
- Implement proper key management
- Add rate limiting for crypto operations

### 3. Location Privacy
- Ring signatures provide plausible deniability
- Differential privacy adds noise to coordinates
- Device fingerprinting enhances privacy

## 📊 Monitoring & Analytics

### 1. Vercel Analytics
- Built-in performance monitoring
- Function execution times
- Error tracking

### 2. Custom Metrics
- Location encryption success rates
- Privacy level usage statistics
- Media upload success rates

## 🔄 Continuous Deployment

### 1. GitHub Integration
- Automatic deployments on push to main branch
- Preview deployments for pull requests
- Environment-specific configurations

### 2. Deployment Pipeline
1. Code pushed to GitHub
2. Vercel automatically builds and deploys
3. Environment variables applied
4. Health checks performed
5. Traffic routed to new deployment

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+ required)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **OAuth Errors**
   - Verify Google OAuth credentials
   - Check redirect URIs in Google Console
   - Ensure environment variables are set

3. **Crypto API Errors**
   - Check function timeout settings
   - Verify crypto library imports
   - Check browser compatibility

4. **Location Issues**
   - Verify geolocation permissions
   - Check coordinate format
   - Test with different privacy levels

## 📞 Support

For deployment issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally first
4. Check GitHub repository for updates

For crypto implementation:
1. Review the crypto library code
2. Test with different key sizes
3. Verify ring signature verification
4. Check privacy level implementations

---

**ThySpace** - Secure, Private, Location-Based Social Platform 🚀🔒📍
