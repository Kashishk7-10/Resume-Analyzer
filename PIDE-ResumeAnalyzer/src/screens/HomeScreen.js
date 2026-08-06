import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOW } from '../constants/theme';

export default function HomeScreen({ navigation }) {
  const features = [
    {
      icon: '📄',
      title: 'Resume Matching',
      description: 'Upload a resume and job description to assess candidate suitability.',
    },
    {
      icon: '🤖',
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning model for intelligent resume screening.',
    },
    {
      icon: '⚡',
      title: 'Instant Results',
      description: 'Get Good Fit, Potential Fit, or No Fit classification in seconds.',
    },
    {
      icon: '📊',
      title: 'Confidence Scores',
      description: 'Detailed probability scores to help make informed hiring decisions.',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>🏛️</Text>
        </View>
        <Text style={styles.orgName}>PIDE</Text>
        <Text style={styles.orgFullName}>Pakistan Institute of Development Economics</Text>
        <View style={styles.divider} />
        <Text style={styles.heroTitle}>AI Resume Analyzer</Text>
        <Text style={styles.heroSubtitle}>
          Streamline your hiring process with intelligent resume screening
        </Text>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Analyzer')}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaButtonText}>Start Analyzing →</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>✓</Text>
          <Text style={styles.statLabel}>Accurate</Text>
        </View>
        <View style={[styles.statCard, styles.statCardMiddle]}>
          <Text style={styles.statNumber}>⚡</Text>
          <Text style={styles.statLabel}>Fast</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>📊</Text>
          <Text style={styles.statLabel}>Detailed</Text>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <Text style={styles.sectionSubtitle}>
          Powered by Machine Learning to assist PIDE's recruitment team
        </Text>

        {features.map((feature, index) => (
          <View key={index} style={styles.featureCard}>
            <Text style={styles.featureIcon}>{feature.icon}</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* CTA Bottom */}
      <View style={styles.bottomCta}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Analyzer')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Analyze a Resume</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('History')}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryButtonText}>View History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 PIDE — AI-Assisted Recruitment Tool</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  hero: {
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  logoContainer: {
    width: 72,
    height: 72,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  logoIcon: {
    fontSize: 36,
  },
  orgName: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.secondary,
    letterSpacing: 4,
  },
  orgFullName: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.accent,
    marginVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
  },
  heroTitle: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '700',
    color: COLORS.secondary,
    textAlign: 'center',
    lineHeight: 40,
  },
  heroSubtitle: {
    fontSize: FONTS.sizes.md,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
  },
  ctaButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.lg,
  },
  ctaButtonText: {
    color: '#1A1A1A',
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryDark,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statCardMiddle: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statNumber: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.accent,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
    textAlign: 'center',
  },
  section: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'flex-start',
    ...SHADOW.small,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: SPACING.md,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  bottomCta: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    ...SHADOW.medium,
  },
  primaryButtonText: {
    color: COLORS.secondary,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  footer: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
});
