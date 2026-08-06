import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOW } from '../constants/theme';

export default function AboutScreen() {
  const techStack = [
    { name: 'React Native (Expo)', role: 'Mobile App Framework' },
    { name: 'Python / Flask', role: 'Backend API' },
    { name: 'Scikit-learn', role: 'ML Library' },
    { name: 'Pandas / NumPy', role: 'Data Processing' },
    { name: 'NLTK', role: 'Text Preprocessing' },
  ];

  const metrics = [
    { label: 'Framework', value: 'Machine Learning' },
    { label: 'Backend', value: 'Flask API' },
    { label: 'Categories', value: '3 Fit Levels' },
    { label: 'Data Processing', value: 'NLTK + TF-IDF' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRing}>
          <Text style={styles.logoEmoji}>🏛️</Text>
        </View>
        <Text style={styles.orgName}>PIDE</Text>
        <Text style={styles.orgFull}>Pakistan Institute of Development Economics</Text>
        <Text style={styles.tagline}>AI-Powered Resume Screening Tool</Text>
      </View>

      <View style={styles.body}>
        {/* About */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About This Tool</Text>
          <Text style={styles.bodyText}>
            This application helps PIDE's recruitment team screen resumes efficiently using
            AI. The model classifies candidates as{' '}
            <Text style={styles.boldGreen}>Good Fit</Text>,{' '}
            <Text style={styles.boldAmber}>Potential Fit</Text>, or{' '}
            <Text style={styles.boldRed}>No Fit</Text> based on how well the resume
            matches the job description.
          </Text>
        </View>

        {/* Model Metrics */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Model Performance</Text>
          {metrics.map((m, i) => (
            <View
              key={i}
              style={[
                styles.metricRow,
                i < metrics.length - 1 && styles.metricBorder,
              ]}
            >
              <Text style={styles.metricLabel}>{m.label}</Text>
              <Text style={styles.metricValue}>{m.value}</Text>
            </View>
          ))}
        </View>

        {/* Tech Stack */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Technology Stack</Text>
          <View style={styles.tagGrid}>
            {techStack.map((tech, i) => (
              <View key={i} style={styles.techTag}>
                <Text style={styles.techName}>{tech.name}</Text>
                <Text style={styles.techRole}>{tech.role}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Dataset */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Technology Overview</Text>
          <Text style={styles.bodyText}>
            This application uses advanced natural language processing and machine learning to classify resumes based on job description fit. The model analyzes text features and semantic similarity to provide intelligent screening recommendations.
          </Text>
        </View>

        {/* Disclaimer */}
        <View style={[styles.card, styles.disclaimerCard]}>
          <Text style={styles.disclaimerTitle}>⚠️ Important Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            This tool is an AI-assisted screening aid only. It does not replace professional
            judgment. All final hiring decisions must be made by qualified HR personnel
            following PIDE's established recruitment policies and procedures.
          </Text>
        </View>

        {/* Contact */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Developer</Text>
          <Text style={styles.bodyText}>Kashish Kumari</Text>
          <TouchableOpacity
            onPress={() => Linking.openURL('mailto:kashishkumari.bscsf22@iba-suk.edu.pk')}
          >
            <Text style={styles.emailLink}>kashishkumari.bscsf22@iba-suk.edu.pk</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>v1.0.0 · MIT License · 2026</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  logoRing: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  logoEmoji: { fontSize: 40 },
  orgName: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '900',
    color: COLORS.secondary,
    letterSpacing: 6,
  },
  orgFull: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  tagline: {
    fontSize: FONTS.sizes.md,
    color: COLORS.accent,
    marginTop: SPACING.sm,
    fontWeight: '600',
  },
  body: {
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW.small,
  },
  cardTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  bodyText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  boldGreen: { color: COLORS.goodFit, fontWeight: '700' },
  boldAmber: { color: COLORS.potentialFit, fontWeight: '700' },
  boldRed: { color: COLORS.noFit, fontWeight: '700' },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  metricBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  metricLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  metricValue: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  techTag: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: '44%',
  },
  techName: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.primary,
  },
  techRole: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  link: { color: COLORS.primary, fontWeight: '600' },
  linkButton: {
    marginTop: SPACING.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: 'rgba(0,132,61,0.08)',
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  linkButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: FONTS.sizes.sm,
  },
  disclaimerCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.potentialFit,
  },
  disclaimerTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.potentialFit,
    marginBottom: SPACING.sm,
  },
  disclaimerText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  emailLink: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.sm,
    marginTop: 4,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    paddingBottom: SPACING.xl,
  },
});
