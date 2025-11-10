import { API_BASE_URL as ENV_API_BASE_URL, JWT_SECRET as ENV_JWT_SECRET, MONGODB_URI as ENV_MONGODB_URI, TMDB_API_KEY as ENV_TMDB_API_KEY } from '@env';
import Constants from 'expo-constants';

// Central config helper used across the app.
// It first attempts to read values from expo config extra (recommended for Expo/EAS),
// then falls back to @env (from .env file via babel plugin), and finally a safe default.

const extra = (Constants.expoConfig && (Constants.expoConfig.extra as any)) || (Constants.manifest && (Constants.manifest.extra as any)) || {};

export const TMDB_API_KEY: string | undefined =
  (extra && extra.TMDB_API_KEY) || ENV_TMDB_API_KEY;

export const TMDB_BASE_URL = (extra && extra.TMDB_BASE_URL) || process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

// Backend/API configuration (for MongoDB + JWT authentication)
export const API_BASE_URL = (extra && extra.API_BASE_URL) || ENV_API_BASE_URL || 'http://localhost:5000/api';

export const MONGODB_URI = (extra && extra.MONGODB_URI) || ENV_MONGODB_URI;

export const JWT_SECRET = (extra && extra.JWT_SECRET) || ENV_JWT_SECRET;

export default {
  TMDB_API_KEY,
  TMDB_BASE_URL,
  API_BASE_URL,
  MONGODB_URI,
  JWT_SECRET,
};
