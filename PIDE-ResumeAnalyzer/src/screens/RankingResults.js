import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  Share,
} from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOW } from '../constants/theme';

export default function RankingResults({ route, navigation }) {
  const { ranked = [], jobDescription = '', totalCandidates = 0 } = route.params || {};
  const [expandedIndex, setExpandedIndex] = useState(null);

  const getScoreColor = (score) => {
    if (score >= 80) return COLORS.goodFit;
    if (score >= 60) return '#FFA500';
    return COLORS.noFit;
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Moderate Match';
    return 'Low Match';
  };

  const handleShare = async (candidate) => {
    try {
      const message = `Candidate: ${candidate.candidateName}\nScore: ${candidate.score.toFixed(2)}%\nLabel: ${candidate.label}`;
      await Share.share({
        message,
        title: `Resume Analysis - ${candidate.candidateName}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share');
    }
  };

  const handleExportResults = async () => {
    try {
      const csv = [
        'Rank,Candidate Name,Score (%),Match Label,Resume File',
        ...ranked.map(
          (c, idx) =>
            `${idx + 1},"${c.candidateName}",${c.score.toFixed(2)},"${c.label}","${c.resumeFilename}"`
        ),
      ].join('\n');

      const message = `Ranking Results\n\nTotal Candidates Analyzed: ${totalCandidates}\n\n${csv}`;
      await Share.share({
        message,
        title: 'Candidate Ranking Results',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not export results');
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const renderCandidateCard = ({ item, index }) => {
    const isExpanded = expandedIndex === index;
    const scoreColor = getScoreColor(item.score);
    const scoreLabel = getScoreLabel(item.score);

    return (
      <View style={styles.candidateCard}>
        {/* Header */}
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => toggleExpand(index)}
          activeOpacity={0.7}
        >
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>#{index + 1}</Text>
          </View>

          <View style={styles.candidateHeader}>
            <Text style={styles.candidateName}>{item.candidateName}</Text>
            <Text style={styles.candidateFile}>📄 {item.resumeFilename}</Text>
          </View>

          <View style={[styles.scoreBox, { backgroundColor: `${scoreColor}20` }]}>
            <Text style={[styles.scorePercentage, { color: scoreColor }]}>
              {item.score.toFixed(1)}%
            </Text>
            <Text style={[styles.scoreLabel, { color: scoreColor }]}>
              {scoreLabel}
            </Text>
          </View>

          <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
        </TouchableOpacity>

        {/* Expanded Details */}
        {isExpanded && (
          <View style={styles.cardDetails}>
            {/* Match Label */}
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Assessment</Text>
              <View
                style={[
                  styles.labelBadge,
                  {
                    backgroundColor:
                      item.label === 'Good Fit'
                        ? 'rgba(40,167,69,0.2)'
                        : item.label === 'Moderate Fit'
                        ? 'rgba(255,165,0,0.2)'
                        : 'rgba(220,53,69,0.2)',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.labelText,
                    {
                      color:
                        item.label === 'Good Fit'
                          ? COLORS.goodFit
                          : item.label === 'Moderate Fit'
                          ? '#FFA500'
                          : COLORS.noFit,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            </View>

            {/* Score Breakdown */}
            {item.scores && Object.keys(item.scores).length > 0 && (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Score Breakdown</Text>
                {Object.entries(item.scores).map(([key, value]) => (
                  <View key={key} style={styles.scoreRow}>
                    <Text style={styles.scoreKey}>{key}</Text>
                    <View style={styles.scoreBar}>
                      <View
                        style={[
                          styles.scoreBarFill,
                          { width: `${Math.min(value * 100, 100)}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.scoreValue}>{(value * 100).toFixed(0)}%</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Resume Preview */}
            {item.resumeText && (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Resume Preview</Text>
                <Text style={styles.resumePreview}>{item.resumeText}...</Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleShare(item)}
              >
                <Text style={styles.actionButtonText}>📤 Share</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonSecondary]}
                onPress={() => {
                  Alert.alert(
                    'Full Resume',
                    item.resumeText,
                    [{ text: 'Close', style: 'cancel' }],
                    { cancelable: true }
                  );
                }}
              >
                <Text style={styles.actionButtonTextSecondary}>👁 View Full</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={styles.statValue}>{totalCandidates}</Text>
            <Text style={styles.statLabel}>Candidates</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statValue}>{ranked[0]?.score.toFixed(1)}%</Text>
            <Text style={styles.statLabel}>Top Score</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={styles.statValue}>
              {ranked.filter((c) => c.score >= 60).length}
            </Text>
            <Text style={styles.statLabel}>Good Match</Text>
          </View>
        </View>

        {/* Results Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Ranking Results</Text>
          <Text style={styles.summaryText}>
            All candidates ranked by job description match. Click any candidate to see detailed analysis.
          </Text>
        </View>

        {/* Candidate List */}
        {ranked.length > 0 ? (
          <View style={styles.candidatesSection}>
            <FlatList
              data={ranked}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderCandidateCard}
              scrollEnabled={false}
            />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No candidates to display</Text>
          </View>
        )}

        {/* Export Button */}
        {ranked.length > 0 && (
          <View style={styles.exportSection}>
            <TouchableOpacity style={styles.exportButton} onPress={handleExportResults}>
              <Text style={styles.exportButtonText}>📥 Export Results as CSV</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 PIDE - Candidate Ranking System</Text>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },

  // Stats Section
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    ...SHADOW.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIcon: { fontSize: 28, marginBottom: SPACING.xs },
  statValue: { fontSize: FONTS.sizes.lg, fontWeight: '900', color: COLORS.primary },
  statLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: SPACING.xs },

  // Summary Section
  summarySection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  summaryTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  summaryText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },

  // Candidates Section
  candidatesSection: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.lg },

  // Candidate Card
  candidateCard: {
    backgroundColor: '#FFF',
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOW.small,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  rankBadge: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: { color: COLORS.secondary, fontWeight: '900', fontSize: FONTS.sizes.md },

  candidateHeader: { flex: 1 },
  candidateName: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.textPrimary },
  candidateFile: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: SPACING.xs },

  scoreBox: {
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
  },
  scorePercentage: { fontSize: FONTS.sizes.lg, fontWeight: '900' },
  scoreLabel: { fontSize: FONTS.sizes.xs, fontWeight: '600', marginTop: SPACING.xs },

  expandIcon: { fontSize: 16, color: COLORS.textMuted },

  // Card Details
  cardDetails: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  detailSection: { marginBottom: SPACING.lg },
  detailLabel: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.sm },

  labelBadge: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  labelText: { fontSize: FONTS.sizes.md, fontWeight: '700' },

  // Score Breakdown
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  scoreKey: { width: 80, fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary },
  scoreBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreBarFill: { height: '100%', backgroundColor: COLORS.primary },
  scoreValue: { width: 40, fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.primary, textAlign: 'right' },

  // Resume Preview
  resumePreview: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  actionButtonText: { color: COLORS.secondary, fontWeight: '700', fontSize: FONTS.sizes.sm },
  actionButtonSecondary: { backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border },
  actionButtonTextSecondary: { color: COLORS.textPrimary, fontWeight: '700', fontSize: FONTS.sizes.sm },

  // Empty State
  emptyState: { paddingVertical: SPACING.xxl, alignItems: 'center' },
  emptyIcon: { fontSize: 60, marginBottom: SPACING.md },
  emptyText: { fontSize: FONTS.sizes.md, color: COLORS.textMuted },

  // Export Section
  exportSection: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.lg },
  exportButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    ...SHADOW.medium,
  },
  exportButtonText: { color: COLORS.secondary, fontWeight: '800', fontSize: FONTS.sizes.md },

  // Footer
  footer: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  footerText: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },

  // Bottom Bar
  bottomBar: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  backButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  backButtonText: { color: COLORS.primary, fontWeight: '700', fontSize: FONTS.sizes.md },
});
