# 🎬 Cineverse - Movie & TV Series Discovery App

A modern, cross-platform movie and TV series discovery application built with React Native, Expo, and TypeScript. Browse popular movies, discover new TV series, watch trailers, and create your personal watchlist.

## ✨ Features

### 🎥 Movie Discovery
- Browse popular, top-rated, and upcoming movies
- Search movies by title
- Filter movies by genre
- View detailed movie information
- Watch official trailers

### 📺 TV Series
- Discover popular TV series
- Browse airing today and on-the-air shows
- View top-rated series
- Detailed series information

### 🎨 User Experience
- Modern, Netflix-inspired UI design
- Dark theme with smooth animations
- Responsive design for mobile and web
- Hero carousel showcasing featured content
- Smooth scrolling movie carousels

### 🔐 User Features
- User authentication system
- Personal profile management
- Create and manage watchlists
- Cross-platform synchronization

### 🎯 Cross-Platform
- **Mobile**: iOS and Android support
- **Web**: Progressive Web App (PWA)
- **Desktop**: Web-based desktop experience

## 🛠️ Tech Stack

### Frontend
- **React Native** - Mobile development framework
- **Expo** - Development platform and tools
- **TypeScript** - Type-safe JavaScript
- **Expo Router** - File-based routing system
- **React Native Reanimated** - Smooth animations

### Styling & UI
- **Expo Linear Gradient** - Beautiful gradients
- **Expo Vector Icons** - Comprehensive icon library
- **Custom components** - Reusable UI components

### API Integration
- **TMDB API** - Movie and TV data
- **Axios** - HTTP client for API requests
- **React Native WebView** - Embedded video playback

### Development Tools
- **Expo Development Client** - Enhanced development experience
- **TypeScript** - Static type checking
- **React Test Renderer** - Component testing

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager
- Expo CLI (optional, can use npx)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ese-tech/movie-app.git
   cd movie-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
   ```
   
   Get your TMDB API key from [The Movie Database (TMDB)](https://www.themoviedb.org/settings/api)

4. **Start the development server**
   ```bash
   npm start
   ```

### Running on Different Platforms

- **iOS Simulator**: `npm run ios`
- **Android Emulator**: `npm run android`
- **Web Browser**: `npm run web`

## 📱 Development Commands

```bash
# Start Expo development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web

# Build for web production
npm run build

# Deploy to Vercel
npm run deploy

# Deploy to Vercel (production)
npm run deploy:prod
```

## 🏗️ Project Structure

```
app/
├── (tabs)/           # Tab-based navigation screens
│   ├── index.tsx     # Home screen
│   ├── movies.tsx    # Movies browser
│   ├── tv-series.tsx # TV series browser
│   ├── genres.tsx    # Genre filter
│   └── profile.tsx   # User profile
├── _layout.tsx       # Root layout
├── login.tsx         # Login screen
├── register.tsx      # Registration screen
└── modal.tsx         # Modal screens

components/
├── Header.tsx               # Navigation header
├── Footer.tsx               # Footer component
├── Sidebar.tsx              # Navigation sidebar
├── UniversalHero.tsx        # Hero carousel
├── HorizontalMovieCarousel.tsx # Movie scroll list
├── MovieCard.tsx            # Individual movie card
├── TrailerModal.tsx         # Video player modal
└── Themed.tsx               # Theme-aware components

context/
└── AuthContext.tsx          # Authentication state

api/
├── tmdb.ts                  # TMDB API client
└── tmdbApi.ts               # API service functions

utils/
├── api.ts                   # API utilities
└── config.ts                # Configuration

constants/
└── Colors.ts                # Color definitions

types.ts                     # TypeScript type definitions
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|---------|
| `EXPO_PUBLIC_TMDB_API_KEY` | TMDB API key for movie data | Yes |

### TMDB API Setup

1. Visit [TMDB](https://www.themoviedb.org/)
2. Create an account
3. Go to Settings → API
4. Request an API key
5. Add the key to your `.env` file

## 🎨 UI Components

### Core Components
- **UniversalHero**: Featured content carousel with backdrop images
- **HorizontalMovieCarousel**: Scrollable movie/TV show lists
- **MovieCard**: Individual content cards with posters and details
- **TrailerModal**: Full-screen video player for trailers
- **Header/Footer**: Navigation and branding components

### Theme System
- Dark-first design approach
- Consistent color palette
- Responsive typography
- Smooth animations and transitions

## 📱 Platform Support

### Mobile (iOS/Android)
- Native performance
- Touch gestures and animations
- Platform-specific UI adaptations
- Offline capability planning

### Web
- Responsive design
- Mouse and keyboard support
- SEO optimization
- Progressive Web App features

## 🚀 Deployment

### Web Deployment (Vercel)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm run deploy
   ```

### Mobile App Store Deployment

1. **Build for production**
   ```bash
   npx expo build:ios
   npx expo build:android
   ```

2. **Submit to app stores**
   ```bash
   npx expo submit
   ```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage
npm run test:coverage
```

## 📚 API Documentation

### TMDB API Endpoints Used
- `/movie/popular` - Popular movies
- `/movie/top_rated` - Top rated movies
- `/movie/upcoming` - Upcoming releases
- `/tv/popular` - Popular TV series
- `/tv/airing_today` - Currently airing shows
- `/search/movie` - Movie search
- `/genre/movie/list` - Movie genres
- `/movie/{id}/videos` - Movie trailers

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Ensure responsive design
- Maintain code documentation

## 🐛 Troubleshooting

### Common Issues

**Metro bundler issues**
```bash
npx expo start --clear
```

**iOS build problems**
```bash
cd ios && pod install
```

**Android build issues**
```bash
cd android && ./gradlew clean
```

**Web build errors**
```bash
rm -rf dist/ && npm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Ese-tech**
- GitHub: [@Ese-tech](https://github.com/Ese-tech)
- Project: [Movie App](https://github.com/Ese-tech/movie-app)

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie and TV data API
- [Expo](https://expo.dev/) for the excellent development platform
- [React Native](https://reactnative.dev/) community for the amazing framework
- [Vercel](https://vercel.com/) for seamless web deployment

## 📊 Project Stats

- **Language**: TypeScript
- **Framework**: React Native with Expo
- **Platform**: Cross-platform (iOS, Android, Web)
- **API**: TMDB (The Movie Database)
- **Deployment**: Vercel (Web), Expo Application Services (Mobile)

---

<div align="center">
  <p>Made with ❤️ by Ese-tech</p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>