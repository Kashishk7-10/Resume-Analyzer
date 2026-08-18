import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { analyzeResume } from '../services/analyzerService';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOW } from '../constants/theme';

const HISTORY_KEY = '@pide_admin_history';

export default function AdminDashboard({ navigation }) {
  const [uploadedResumes, setUploadedResumes] = useState([]); // Array of {id, filename, text, wordCount}
  const [jobDescription, setJobDescription] = useState('');
  const [jobDescFileName, setJobDescFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const resumeInputRef = useRef(null);
  const jobInputRef = useRef(null);
  const [uploadedJobFileName, setUploadedJobFileName] = useState('');

  // Initialize file inputs for web
  React.useEffect(() => {
    if (Platform.OS === 'web') {
      // Create hidden resume file input (allow multiple)
      const resumeInput = document.createElement('input');
      resumeInput.type = 'file';
      resumeInput.accept = '.pdf,.doc,.docx,.txt';
      resumeInput.multiple = true;
      resumeInput.style.display = 'none';
      resumeInput.onchange = (e) => handleWebFileSelect(e, 'resumes');
      document.body.appendChild(resumeInput);
      resumeInputRef.current = resumeInput;

      // Create hidden job file input
      const jobInput = document.createElement('input');
      jobInput.type = 'file';
      jobInput.accept = '.pdf,.doc,.docx,.txt';
      jobInput.style.display = 'none';
      jobInput.onchange = (e) => handleWebFileSelect(e, 'job');
      document.body.appendChild(jobInput);
      jobInputRef.current = jobInput;

      return () => {
        if (document.body.contains(resumeInput)) document.body.removeChild(resumeInput);
        if (document.body.contains(jobInput)) document.body.removeChild(jobInput);
      };
    }
  }, []);

  // Handle file selection on web
  const handleWebFileSelect = async (event, type) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    if (type === 'resumes') {
      // Upload multiple resumes
      for (const file of files) {
        try {
          console.log(`Extracting from: ${file.name}`);
          const text = await extractTextFromFile(file);
          const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;

          setUploadedResumes((prev) => [
            ...prev,
            {
              id: Date.now().toString() + Math.random(),
              filename: file.name,
              text,
              wordCount,
            },
          ]);
        } catch (error) {
          Alert.alert('Error', `Could not extract text from ${file.name}: ${error.message}`);
        }
      }
      Alert.alert('Success', `✅ ${files.length} resume(s) uploaded successfully`);
    } else if (type === 'job') {
      // Upload single job description
      try {
        console.log(`Extracting job description from: ${files[0].name}`);
        const text = await extractTextFromFile(files[0]);
        setJobDescription(text);
        setUploadedJobFileName(files[0].name);
        Alert.alert('Success', `✅ ${files[0].name}\n${text.split(' ').length} words extracted`);
      } catch (error) {
        Alert.alert('Error', `Could not extract text: ${error.message}`);
      }
    }
  };

  // Extract text from files (PDF, DOC, DOCX, TXT)
  const extractTextFromFile = (file) => {
    return new Promise((resolve, reject) => {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        extractPDF(file).then(resolve).catch(reject);
      } else if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
        extractWord(file).then(resolve).catch(reject);
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        extractText(file).then(resolve).catch(reject);
      } else {
        reject(new Error('Unsupported file format'));
      }
    });
  };

  // Extract text from PDF
  const extractPDF = (file) => {
    return new Promise(async (resolve, reject) => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfjsLib = require('pdfjs-dist/legacy/build/pdf');
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item) => item.str || '').join(' ');
          fullText += pageText + '\n';
        }

        resolve(fullText.trim().replace(/\s+/g, ' '));
      } catch (error) {
        reject(new Error(`PDF extraction failed: ${error.message}`));
      }
    });
  };

  // Extract text from Word documents
  const extractWord = (file) => {
    return new Promise(async (resolve, reject) => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const mammoth = require('mammoth');
        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(result.value.trim().replace(/\s+/g, ' '));
      } catch (error) {
        reject(new Error(`Word extraction failed: ${error.message}`));
      }
    });
  };

  // Extract text from plain text files
  const extractText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          resolve(text.trim().replace(/\s+/g, ' '));
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Could not read file'));
      reader.readAsText(file);
    });
  };

  // Handle file picker
  const handlePickResumes = () => {
    if (Platform.OS === 'web' && resumeInputRef.current) {
      resumeInputRef.current.click();
    }
  };

  const handlePickJobDescription = () => {
    if (Platform.OS === 'web' && jobInputRef.current) {
      jobInputRef.current.click();
    }
  };

  // Remove resume from list
  const handleRemoveResume = (id) => {
    setUploadedResumes((prev) => prev.filter((r) => r.id !== id));
  };

  // Analyze all resumes and rank candidates
  const handleRankCandidates = async () => {
    if (uploadedResumes.length === 0) {
      Alert.alert('Missing Resumes', 'Please upload at least one resume.');
      return;
    }
    if (!jobDescription.trim()) {
      Alert.alert('Missing Job Description', 'Please upload or paste job description text.');
      return;
    }
    if (jobDescription.trim().length < 50) {
      Alert.alert('Job Description Too Short', 'Job description must be at least 50 characters.');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Analyze each resume against job description
      const results = [];
      for (const resume of uploadedResumes) {
        try {
          const result = await analyzeResume(resume.text, jobDescription.trim());
          results.push({
            candidateName: resume.filename.replace(/\.(pdf|doc|docx|txt)$/i, ''),
            resumeFilename: resume.filename,
            score: result.confidence || 0,
            label: result.label || 'Not Evaluated',
            scores: result.scores || {},
            resumeText: resume.text.substring(0, 500),
          });
        } catch (error) {
          console.error(`Error analyzing ${resume.filename}:`, error);
          // Continue with other resumes
        }
      }

      // Sort by score descending
      const ranked = results.sort((a, b) => b.score - a.score);

      // Save to history
      try {
        const raw = await AsyncStorage.getItem(HISTORY_KEY);
        const existing = raw ? JSON.parse(raw) : [];
        const entry = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          candidateCount: uploadedResumes.length,
          topCandidate: ranked[0]?.candidateName || 'N/A',
          topScore: ranked[0]?.score || 0,
          ranked,
        };
        const updated = [entry, ...existing].slice(0, 20);
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (e) {
        // Non-critical
      }

      // Navigate to results
      navigation.navigate('RankingResults', {
        ranked,
        jobDescription: jobDescription.trim(),
        totalCandidates: uploadedResumes.length,
      });
    } catch (error) {
      Alert.alert('Error', `Ranking failed: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClearAll = () => {
    Alert.alert('Clear All', 'Remove all uploads?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          setUploadedResumes([]);
          setJobDescription('');
          setUploadedJobFileName('');
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.logoIcon}>🏛️</Text>
            <View>
              <Text style={styles.logoText}>PIDE</Text>
              <Text style={styles.logoSubtext}>HR Portal</Text>
            </View>
          </View>
          <Text style={styles.headerTitle}>Bulk Ranking</Text>
        </View>

        {/* About Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Candidate Ranking System</Text>
          <Text style={styles.infoText}>
            Upload multiple resumes and a job description. Our AI system will automatically analyze and rank candidates based on their match with job requirements.
          </Text>
        </View>

        {/* Job Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Description</Text>

          {uploadedJobFileName ? (
            <View style={styles.uploadedBox}>
              <Text style={styles.uploadedIcon}>✅</Text>
              <Text style={styles.uploadedFileName}>{uploadedJobFileName}</Text>
              <Text style={styles.uploadedDetails}>{jobDescription.split(' ').length} words</Text>
              <TouchableOpacity
                onPress={() => {
                  setJobDescription('');
                  setUploadedJobFileName('');
                }}
                style={styles.removeBtn}
              >
                <Text style={styles.removeBtnText}>✕ Remove</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.changeButton}
                onPress={handlePickJobDescription}
              >
                <Text style={styles.changeButtonText}>Change Job Description</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handlePickJobDescription}
            >
              <Text style={styles.uploadIcon}>📋</Text>
              <Text style={styles.uploadButtonText}>Click to upload Job Description</Text>
              <Text style={styles.uploadHint}>PDF, DOC, DOCX or TXT (Max 10MB)</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Resumes Section */}
        <View style={styles.section}>
          <View style={styles.resumesHeader}>
            <Text style={styles.sectionTitle}>Resumes ({uploadedResumes.length})</Text>
            <TouchableOpacity style={styles.addButton} onPress={handlePickResumes}>
              <Text style={styles.addButtonText}>+ Add Resumes</Text>
            </TouchableOpacity>
          </View>

          {uploadedResumes.length === 0 ? (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handlePickResumes}
            >
              <Text style={styles.uploadIcon}>📄</Text>
              <Text style={styles.uploadButtonText}>Click to upload Resumes</Text>
              <Text style={styles.uploadHint}>Upload multiple files (PDF, DOC, DOCX or TXT)</Text>
            </TouchableOpacity>
          ) : (
            <View>
              <FlatList
                data={uploadedResumes}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={styles.resumeItem}>
                    <View style={styles.resumeInfo}>
                      <Text style={styles.resumeFileName}>📄 {item.filename}</Text>
                      <Text style={styles.resumeWordCount}>{item.wordCount} words</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveResume(item.id)}
                      style={styles.removeIconBtn}
                    >
                      <Text style={styles.removeIcon}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
              <TouchableOpacity style={styles.addMoreButton} onPress={handlePickResumes}>
                <Text style={styles.addMoreButtonText}>+ Add More Resumes</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Rank Button */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[
              styles.rankButton,
              (!uploadedResumes.length || !jobDescription || isAnalyzing) && styles.rankButtonDisabled,
            ]}
            onPress={handleRankCandidates}
            disabled={!uploadedResumes.length || !jobDescription || isAnalyzing}
          >
            {isAnalyzing ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={COLORS.secondary} size="small" />
                <Text style={styles.rankButtonText}>  Analyzing Candidates...</Text>
              </View>
            ) : (
              <Text style={styles.rankButtonText}>🎯 Rank Candidates ({uploadedResumes.length})</Text>
            )}
          </TouchableOpacity>

          {uploadedResumes.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 PIDE - Pakistan Institute of Development Economics</Text>
          <Text style={styles.footerText}>HR Portal for Candidate Ranking</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },

  // Header
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    ...SHADOW.small,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  logoIcon: { fontSize: 32 },
  logoText: { fontSize: FONTS.sizes.lg, fontWeight: '900', color: COLORS.secondary },
  logoSubtext: { fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.8)', marginTop: -2 },
  headerTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.secondary },

  // Info Section
  infoSection: { paddingVertical: SPACING.xl, paddingHorizontal: SPACING.lg, backgroundColor: '#FFF' },
  sectionTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.textPrimary, marginBottom: SPACING.md },
  infoText: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, lineHeight: 26 },

  // Sections
  section: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  resumesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
  },
  addButtonText: { color: COLORS.secondary, fontSize: FONTS.sizes.sm, fontWeight: '700' },

  // Upload Button
  uploadButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    backgroundColor: 'rgba(0,132,61,0.05)',
  },
  uploadIcon: { fontSize: 40, marginBottom: SPACING.sm },
  uploadButtonText: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.primary, textAlign: 'center' },
  uploadHint: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: SPACING.xs },

  // Uploaded Box
  uploadedBox: {
    backgroundColor: 'rgba(40,167,69,0.1)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.goodFit,
  },
  uploadedIcon: { fontSize: 40, marginBottom: SPACING.sm },
  uploadedFileName: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary },
  uploadedDetails: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, marginTop: SPACING.xs },
  removeBtn: { marginTop: SPACING.md },
  removeBtnText: { fontSize: FONTS.sizes.sm, color: COLORS.noFit, fontWeight: '600' },

  changeButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: 'rgba(0,132,61,0.1)',
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  changeButtonText: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '600' },

  // Resume List
  resumeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resumeInfo: { flex: 1 },
  resumeFileName: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary },
  resumeWordCount: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: SPACING.xs },
  removeIconBtn: { padding: SPACING.sm },
  removeIcon: { fontSize: 20, color: COLORS.noFit },

  addMoreButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  addMoreButtonText: { color: COLORS.primary, fontSize: FONTS.sizes.md, fontWeight: '700' },

  // Action Section
  actionSection: {
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  rankButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOW.medium,
  },
  rankButtonDisabled: {
    backgroundColor: COLORS.textMuted,
    ...SHADOW.small,
  },
  rankButtonText: {
    color: COLORS.secondary,
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  loadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },

  clearButton: {
    borderWidth: 1,
    borderColor: COLORS.textMuted,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  clearButtonText: { color: COLORS.textMuted, fontSize: FONTS.sizes.md, fontWeight: '700' },

  // Footer
  footer: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  footerText: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginVertical: SPACING.xs,
  },
});
