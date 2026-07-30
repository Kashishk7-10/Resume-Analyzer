import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOW } from '../constants/theme';

const HISTORY_KEY = '@pide_resume_history';

const LABEL_COLORS = {
  'Good Fit': COLORS.goodFit,
  'Potential Fit': COLORS.potentialFit,
  'No Fit': COLORS.noFit,
};

const LABEL_ICONS = {
  'Good Fit': '✅',
  'Potential Fit': '⚠️',
  'No Fit': '❌',
};

export default function HistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
    const unsubscribe = navigation.addListener('focus', loadHistory);
    return unsubscribe;
  }, [navigation]);

  const loadHistory = async () => {
    try {
      const raw = await AsyncStorage.getItem(HISTORY_KEY);
      if (raw) {
        setHistory(JSON.parse(raw));
      }
    } catch {
      // ignore read errors
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    Alert.alert('Clear History', 'Delete all analysis history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete All',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem(HISTORY_KEY);
          setHistory([]);
        },
      },
    ]);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderItem = ({ item }) => {
    const color = LABEL_COLORS[item.label] || COLORS.textSecondary;
    const icon = LABEL_ICONS[item.label] || '❓';
    const confidence = Math.round((item.confidence || 0) * 100);

    return (
      <TouchableOpacity
        style={styles.historyCard}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('Result', {
            result: { label: item.label, confidence: item.confidence, scores: item.scores },
            resumeText: item.resumeText,
            jobDescText: item.jobDescText,
          })
        }
      >
        <View style={[styles.labelBadge, { backgroundColor: color }]}>
          <Text style={styles.labelIcon}>{icon}</Text>
          <Text style={styles.labelText}>{item.label}</Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.snippetTitle}>Resume snippet:</Text>
          <Text style={styles.snippet} numberOfLines={2}>
            {item.resumeText}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>Confidence: {confidence}%</Text>
            <Text style={styles.metaText}>{formatDate(item.date)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {history.length > 0 ? (
        <>
          <View style={styles.headerRow}>
            <Text style={styles.countText}>{history.length} analysis records</Text>
            <TouchableOpacity onPress={clearHistory}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No History Yet</Text>
          <Text style={styles.emptyText}>
            Your analysis results will appear here after you analyze a resume.
          </Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigation.navigate('Analyzer')}
          >
            <Text style={styles.startButtonText}>Start Analyzing</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  countText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  clearText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.noFit,
    fontWeight: '600',
  },
  list: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  historyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    ...SHADOW.small,
  },
  labelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    gap: SPACING.xs,
  },
  labelIcon: { fontSize: 14 },
  labelText: {
    color: COLORS.secondary,
    fontWeight: '700',
    fontSize: FONTS.sizes.sm,
  },
  cardBody: {
    padding: SPACING.md,
  },
  snippetTitle: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginBottom: 4,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  snippet: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
  },
  startButtonText: {
    color: COLORS.secondary,
    fontWeight: '700',
    fontSize: FONTS.sizes.md,
  },
});
