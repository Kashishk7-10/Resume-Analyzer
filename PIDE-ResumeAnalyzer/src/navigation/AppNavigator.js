import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import AnalyzerScreen from '../screens/AnalyzerScreen';
import ResultScreen from '../screens/ResultScreen';
import HistoryScreen from '../screens/HistoryScreen';
import AboutScreen from '../screens/AboutScreen';
import AdminDashboard from '../screens/AdminDashboard';
import RankingResults from '../screens/RankingResults';

import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOW } from '../constants/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab icons
const TAB_ICONS = {
  Home: '🏠',
  Candidate: '👤',
  History: '📋',
  About: 'ℹ️',
};

// Role Selector Screen
function RoleSelector({ setUserRole }) {
  return (
    <View style={styles.roleContainer}>
      <View style={styles.roleContent}>
        <Text style={styles.roleTitle}>Welcome to PIDE Resume System</Text>
        <Text style={styles.roleSubtitle}>Select your role to continue</Text>

        <TouchableOpacity
          style={[styles.roleButton, styles.candidateButton]}
          onPress={() => setUserRole('candidate')}
        >
          <Text style={styles.roleIcon}>👤</Text>
          <Text style={styles.roleButtonTitle}>Job Seeker</Text>
          <Text style={styles.roleButtonDesc}>
            Upload your resume and apply for positions at PIDE
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleButton, styles.adminButton]}
          onPress={() => setUserRole('admin')}
        >
          <Text style={styles.roleIcon}>👨‍💼</Text>
          <Text style={styles.roleButtonTitle}>HR Manager</Text>
          <Text style={styles.roleButtonDesc}>
            Upload bulk resumes and rank candidates automatically
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CandidateTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
            {TAB_ICONS[route.name]}
          </Text>
        ),
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: FONTS.sizes.xs,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.secondary,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: FONTS.sizes.md,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'PIDE' }}
      />
      <Tab.Screen
        name="Candidate"
        component={AnalyzerScreen}
        options={{ title: 'Apply Now' }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'My Applications' }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{ title: 'About' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [userRole, setUserRole] = useState(null); // null (selection), 'candidate', or 'admin'

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userRole === null ? (
          // Role Selection Screen
          <Stack.Screen
            name="RoleSelect"
            options={{ headerShown: false }}
          >
            {() => <RoleSelector setUserRole={setUserRole} />}
          </Stack.Screen>
        ) : userRole === 'candidate' ? (
          <>
            {/* Candidate Flow */}
            <Stack.Screen
              name="CandidateMain"
              component={CandidateTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Result"
              component={ResultScreen}
              options={{
                title: 'Analysis Result',
                headerStyle: { backgroundColor: COLORS.primary },
                headerTintColor: COLORS.secondary,
                headerTitleStyle: { fontWeight: '700' },
              }}
            />
            <Stack.Screen
              name="SwitchRole"
              options={{ headerShown: false }}
            >
              {() => {
                setUserRole(null);
                return <View />;
              }}
            </Stack.Screen>
          </>
        ) : (
          <>
            {/* Admin Flow */}
            <Stack.Screen
              name="AdminMain"
              component={AdminDashboard}
              options={{
                title: 'Admin Dashboard',
                headerStyle: { backgroundColor: COLORS.primary },
                headerTintColor: COLORS.secondary,
                headerTitleStyle: { fontWeight: '700' },
              }}
            />
            <Stack.Screen
              name="RankingResults"
              component={RankingResults}
              options={{
                title: 'Candidate Rankings',
                headerStyle: { backgroundColor: COLORS.primary },
                headerTintColor: COLORS.secondary,
                headerTitleStyle: { fontWeight: '700' },
              }}
            />
            <Stack.Screen
              name="SwitchToCandidate"
              options={{ headerShown: false }}
            >
              {() => {
                setUserRole(null);
                return <View />;
              }}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  roleContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  roleContent: {
    alignItems: 'center',
  },
  roleTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  roleSubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  roleButton: {
    width: '100%',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    alignItems: 'center',
    ...SHADOW.medium,
  },
  candidateButton: {
    backgroundColor: 'rgba(0,132,61,0.1)',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  adminButton: {
    backgroundColor: 'rgba(0,132,61,0.2)',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  roleIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  roleButtonTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  roleButtonDesc: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
