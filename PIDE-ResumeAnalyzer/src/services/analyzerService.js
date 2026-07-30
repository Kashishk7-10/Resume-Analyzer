import axios from 'axios';
import { BASE_URL, ENDPOINTS, API_TIMEOUT } from '../constants/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Analyze a resume against a job description.
 * @param {string} resumeText - The candidate's resume text.
 * @param {string} jobDescriptionText - The job description text.
 * @returns {Promise<{label: string, confidence: number, scores: object}>}
 */
export const analyzeResume = async (resumeText, jobDescriptionText) => {
  const response = await apiClient.post(ENDPOINTS.analyze, {
    resume_text: resumeText,
    job_description_text: jobDescriptionText,
  });
  return response.data;
};

/**
 * Check if the backend API is reachable.
 * @returns {Promise<boolean>}
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get(ENDPOINTS.health);
    return response.status === 200;
  } catch {
    return false;
  }
};
