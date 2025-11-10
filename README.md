# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Setup (TMDB + MongoDB)

This project is a Netflix clone using React Native + TypeScript + Expo with MongoDB for authentication and user data.

### Prerequisites

1. **TMDB API Setup**
   - Create an account at https://www.themoviedb.org
   - Go to Settings → API → Create API Key (v3)
   - Copy your API key

2. **MongoDB Setup**
   - Create a MongoDB Atlas cluster (free tier available)
   - Get your connection string
   - Create a database called `movieapp`

3. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Fill in your TMDB API key and MongoDB URI
   - Set a strong JWT secret

### Local Development

```bash
# Install dependencies
npm install

# Start the backend server (in one terminal)
cd server && npm start

# Start the Expo app (in another terminal)
npm start
```

### Tech Stack
- **Frontend**: React Native + TypeScript + Expo
- **Backend**: Node.js + Express + MongoDB + JWT
- **Database**: MongoDB Atlas
- **API**: TMDB for movie data
- **Authentication**: JWT-based (no Firebase)

### Project Structure
- `/app` - Expo Router pages (TypeScript)
- `/components` - Reusable UI components
- `/context` - React Context providers
- `/utils` - API helpers and configuration
- `/server` - Backend API with MongoDB

Firebase removed
- This project uses MongoDB + JWT for authentication instead of Firebase
- All Firebase code has been removed for simplicity and Vercel compatibility

