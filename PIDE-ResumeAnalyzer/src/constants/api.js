// API Configuration
// Update BASE_URL to your deployed backend URL

// For local development (when running on the same machine):
// const BASE_URL = 'http://localhost:5000';

// For Android emulator connecting to host machine:
// const BASE_URL = 'http://10.0.2.2:5000';

// For physical device (replace with your machine's local IP):
// const BASE_URL = 'http://192.168.1.100:5000';

// For production deployment:
// const BASE_URL = 'https://api.pide.org.pk/resume-analyzer';

export const BASE_URL = 'http://10.0.2.2:5000'; // Change this for your setup

export const ENDPOINTS = {
  analyze: '/analyze',
  health: '/health',
};

export const API_TIMEOUT = 30000; // 30 seconds
