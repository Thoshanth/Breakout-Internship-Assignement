// src/navigation/AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import LeadsScreen from '../screens/LeadsScreen';
import EscalationsScreen from '../screens/EscalationsScreen';
import FollowUpsScreen from '../screens/FollowUpsScreen';
import ConversationDetailScreen from '../screens/ConversationDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ACTIVE_COLOR = '#534AB7';
const INACTIVE_COLOR = '#888';

function LeadsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LeadsList" component={LeadsScreen} />
      <Stack.Screen name="ConversationDetail" component={ConversationDetailScreen} />
    </Stack.Navigator>
  );
}

function EscalationsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EscalationsList" component={EscalationsScreen} />
      <Stack.Screen name="ConversationDetail" component={ConversationDetailScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: { borderTopWidth: 0.5, borderTopColor: 'rgba(0,0,0,0.1)', height: 60, paddingBottom: 8 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home-outline',
            Leads: 'people-outline',
            Escalations: 'warning-outline',
            'Follow-ups': 'time-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Leads" component={LeadsStack} />
      <Tab.Screen name="Escalations" component={EscalationsStack} />
      <Tab.Screen name="Follow-ups" component={FollowUpsScreen} />
    </Tab.Navigator>
  );
}