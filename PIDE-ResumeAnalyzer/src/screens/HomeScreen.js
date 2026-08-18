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
      {/* Header with PIDE Logo */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🏛️</Text>
        </View>
        <View>
          <Text style={styles.pideTitle}>PIDE</Text>
          <Text style={styles.pideSubtitle}>Pakistan Institute</Text>
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Career Portal</Text>
        <Text style={styles.heroSubtitle}>
          Join PIDE's team of talented professionals dedicated to advancing economic development and research excellence
        </Text>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Candidate')}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaButtonText}>🚀 Apply Now</Text>
        </TouchableOpacity>
      </View>

      {/* About PIDE Section */}
      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>About PIDE</Text>
        <Text style={styles.aboutText}>
          The Pakistan Institute of Development Economics (PIDE) is Pakistan's premier independent research institute dedicated to advancing knowledge and policy expertise in economics and development. Since its establishment, PIDE has been at the forefront of economic research, policy analysis, and institutional development.
        </Text>
        
        <Text style={styles.aboutSubheading}>Our Mission</Text>
        <Text style={styles.aboutText}>
          To conduct rigorous research, provide evidence-based policy advice, and develop human capital in economics and related fields to support Pakistan's sustainable development.
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>👥</Text>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>Alumni</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>📚</Text>
            <Text style={styles.statNumber}>50+</Text>
            <Text style={styles.statLabel}>Research Projects</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>🌟</Text>
            <Text style={styles.statNumber}>20+</Text>
            <Text style={styles.statLabel}>Years Excellence</Text>
          </View>
        </View>
      </View>

      {/* Portal Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About This Portal</Text>
        <Text style={styles.sectionSubtitle}>
          Smart Resume Matching & Candidate Ranking System
        </Text>
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
    backgroundColor: '#F8F9FA',
  },
  // Header with Logo
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  logoBox: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 28,
  },
  pideTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '900',
    color: COLORS.secondary,
  },
  pideSubtitle: {
    fontSize: FONTS.sizes.xs,
    color: 'rgba(255,255,255,0.8)',
    marginTop: -2,
  },
  // Hero Section
  hero: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '800',
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  heroSubtitle: {
    fontSize: FONTS.sizes.md,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  ctaButton: {
    backgroundColor: '#FFD700',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.xl,
  },
  ctaButtonText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  // About PIDE Section
  aboutSection: {
    backgroundColor: '#FFF',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  aboutTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  aboutText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 26,
    marginBottom: SPACING.lg,
  },
  aboutSubheading: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  // Stats Row
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  statNumber: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '900',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  // Section
  section: {
    padding: SPACING.lg,
    backgroundColor: '#FFF',
    marginVertical: SPACING.md,
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
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'flex-start',
    ...SHADOW.small,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
    backgroundColor: '#FFF',
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
    backgroundColor: COLORS.primary,
  },
  footerText: {
    fontSize: FONTS.sizes.xs,
    color: 'rgba(255,255,255,0.8)',
  },
});
