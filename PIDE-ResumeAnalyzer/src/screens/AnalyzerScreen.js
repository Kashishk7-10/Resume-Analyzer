import React, { useState } from 'react';
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
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { analyzeResume } from '../services/analyzerService';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOW } from '../constants/theme';

const HISTORY_KEY = '@pide_resume_history';

export default function AnalyzerScreen({ navigation }) {
  const [resumeText, setResumeText] = useState('');
  const [jobDescText, setJobDescText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('resume'); // 'resume' | 'job'

  const handlePickDocument = async (type) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const { parseFile, validateFileSize } = await import('../services/fileParserService');
        
        try {
          validateFileSize(asset.size || 0);
          const content = await parseFile(asset.uri, asset.mimeType || '');
          
          if (type === 'resume') {
            setResumeText(content);
          } else {
            setJobDescText(content);
          }
          Alert.alert('Success', `${asset.name} loaded successfully!`);
        } catch (parseError) {
          Alert.alert('Parse Error', parseError.message || 'Could not parse the file. Please try another file or paste manually.');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Could not read the file. Please try pasting the text manually.');
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      Alert.alert('Missing Resume', 'Please enter or upload the resume text.');
      return;
    }
    if (!jobDescText.trim()) {
      Alert.alert('Missing Job Description', 'Please enter or upload the job description text.');
      return;
    }
    if (resumeText.trim().length < 50) {
      Alert.alert('Resume Too Short', 'Please provide a more complete resume (at least 50 characters).');
      return;
    }

    setIsLoading(true);
    try {
      const result = await analyzeResume(resumeText.trim(), jobDescText.trim());

      // Save to local history
      try {
        const raw = await AsyncStorage.getItem(HISTORY_KEY);
        const existing = raw ? JSON.parse(raw) : [];
        const entry = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          label: result.label,
          confidence: result.confidence,
          scores: result.scores,
          resumeText: resumeText.trim().substring(0, 300),
          jobDescText: jobDescText.trim().substring(0, 300),
        };
        const updated = [entry, ...existing].slice(0, 50); // keep last 50
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch {
        // history save failure is non-critical
      }

      navigation.navigate('Result', {
        result,
        resumeText: resumeText.trim(),
        jobDescText: jobDescText.trim(),
      });
    } catch (error) {
      const msg =
        error.code === 'ECONNABORTED'
          ? 'Request timed out. Please check your internet connection.'
          : error.response?.data?.error ||
            'Could not connect to the server. Make sure the backend is running.';
      Alert.alert('Analysis Failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    Alert.alert('Clear All', 'Are you sure you want to clear all inputs?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          setResumeText('');
          setJobDescText('');
        },
      },
    ]);
  };

  const wordCount = (text) => {
    const words = text.trim().split(/\s+/).filter((w) => w.length > 0);
    return words.length;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Resume Screening Tool</Text>
          <Text style={styles.bannerSubtitle}>
            Paste or upload the resume and job description below
          </Text>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'resume' && styles.tabActive]}
            onPress={() => setActiveTab('resume')}
          >
            <Text style={[styles.tabText, activeTab === 'resume' && styles.tabTextActive]}>
              📄 Resume
            </Text>
            {resumeText.length > 0 && <View style={styles.tabBadge} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'job' && styles.tabActive]}
            onPress={() => setActiveTab('job')}
          >
            <Text style={[styles.tabText, activeTab === 'job' && styles.tabTextActive]}>
              💼 Job Description
            </Text>
            {jobDescText.length > 0 && <View style={styles.tabBadge} />}
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          {/* Resume Input */}
          {activeTab === 'resume' && (
            <View style={styles.inputSection}>
              <View style={styles.inputHeader}>
                <Text style={styles.inputLabel}>Candidate Resume</Text>
                <Text style={styles.wordCountText}>{wordCount(resumeText)} words</Text>
              </View>

              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => handlePickDocument('resume')}
              >
                <Text style={styles.uploadButtonText}>📎 Upload Resume (TXT, PDF, DOC)</Text>
              </TouchableOpacity>

              <View style={styles.orRow}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>or paste manually</Text>
                <View style={styles.orLine} />
              </View>

              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={12}
                placeholder="Paste the full resume text here...&#10;&#10;Include: Summary, Skills, Experience, Education"
                placeholderTextColor={COLORS.textMuted}
                value={resumeText}
                onChangeText={setResumeText}
                textAlignVertical="top"
              />

              {resumeText.length > 0 && (
                <TouchableOpacity onPress={() => setResumeText('')} style={styles.clearFieldBtn}>
                  <Text style={styles.clearFieldText}>✕ Clear resume</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Job Description Input */}
          {activeTab === 'job' && (
            <View style={styles.inputSection}>
              <View style={styles.inputHeader}>
                <Text style={styles.inputLabel}>Job Description</Text>
                <Text style={styles.wordCountText}>{wordCount(jobDescText)} words</Text>
              </View>

              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => handlePickDocument('job')}
              >
                <Text style={styles.uploadButtonText}>📎 Upload Job Description (TXT, PDF, DOC)</Text>
              </TouchableOpacity>

              <View style={styles.orRow}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>or paste manually</Text>
                <View style={styles.orLine} />
              </View>

              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={12}
                placeholder="Paste the full job description here...&#10;&#10;Include: Role, Requirements, Qualifications, Responsibilities"
                placeholderTextColor={COLORS.textMuted}
                value={jobDescText}
                onChangeText={setJobDescText}
                textAlignVertical="top"
              />

              {jobDescText.length > 0 && (
                <TouchableOpacity onPress={() => setJobDescText('')} style={styles.clearFieldBtn}>
                  <Text style={styles.clearFieldText}>✕ Clear job description</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Status Row */}
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: resumeText.length > 0 ? COLORS.goodFit : COLORS.border },
                ]}
              />
              <Text style={styles.statusText}>Resume</Text>
            </View>
            <View style={styles.statusItem}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: jobDescText.length > 0 ? COLORS.goodFit : COLORS.border },
                ]}
              />
              <Text style={styles.statusText}>Job Description</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={[
              styles.analyzeButton,
              (isLoading || !resumeText || !jobDescText) && styles.analyzeButtonDisabled,
            ]}
            onPress={handleAnalyze}
            disabled={isLoading || !resumeText || !jobDescText}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={COLORS.secondary} size="small" />
                <Text style={styles.analyzeButtonText}>  Analyzing...</Text>
              </View>
            ) : (
              <Text style={styles.analyzeButtonText}>🔍 Analyze Resume</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.clearButton} onPress={handleClear} activeOpacity={0.7}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Tips for Best Results</Text>
          <Text style={styles.tipItem}>• Use the full resume text, not a summary</Text>
          <Text style={styles.tipItem}>• Include the complete job description with requirements</Text>
          <Text style={styles.tipItem}>• Supported formats: TXT, PDF, DOC, DOCX</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  banner: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  bannerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  bannerSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  tabBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.goodFit,
    marginLeft: 6,
  },
  formContainer: {
    padding: SPACING.lg,
  },
  inputSection: {
    marginBottom: SPACING.md,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  inputLabel: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  wordCountText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  uploadButton: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    backgroundColor: 'rgba(0,132,61,0.04)',
    marginBottom: SPACING.sm,
  },
  uploadButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: FONTS.sizes.sm,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  orText: {
    marginHorizontal: SPACING.sm,
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    minHeight: 200,
    lineHeight: 20,
    ...SHADOW.small,
  },
  clearFieldBtn: {
    alignSelf: 'flex-end',
    marginTop: SPACING.xs,
    padding: SPACING.xs,
  },
  clearFieldText: {
    color: COLORS.noFit,
    fontSize: FONTS.sizes.xs,
  },
  statusRow: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    gap: SPACING.lg,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  analyzeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md + 2,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.sm,
    ...SHADOW.medium,
  },
  analyzeButtonDisabled: {
    backgroundColor: COLORS.textMuted,
    ...SHADOW.small,
  },
  analyzeButtonText: {
    color: COLORS.secondary,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  clearButtonText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
  },
  tipsCard: {
    margin: SPACING.lg,
    marginTop: 0,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
    ...SHADOW.small,
  },
  tipsTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  tipItem: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});
