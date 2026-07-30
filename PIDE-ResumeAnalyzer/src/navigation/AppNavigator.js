import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import AnalyzerScreen from '../screens/AnalyzerScreen';
import ResultScreen from '../screens/ResultScreen';
import HistoryScreen from '../screens/HistoryScreen';
import AboutScreen from '../screens/AboutScreen';

import { COLORS, FONTS } from '../constants/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab icons (text-based, no dependency on icon libraries)
const TAB_ICONS = {
  Home: '🏠',
  Analyzer: '🔍',
  History: '📋',
  About: 'ℹ️',
};

function TabNavigator() {
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
        options={{ title: 'PIDE Resume Analyzer' }}
      />
      <Tab.Screen
        name="Analyzer"
        component={AnalyzerScreen}
        options={{ title: 'Analyze Resume' }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'Analysis History' }}
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
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Main tabs */}
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        {/* Result screen pushed on top */}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
