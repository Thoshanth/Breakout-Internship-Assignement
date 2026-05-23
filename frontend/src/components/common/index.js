// src/components/common/index.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// src/components/common/EmptyState.js
export default function EmptyState({ icon = 'inbox-outline', message }) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color="#C4C2B9" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

// src/components/common/Avatar.js
export function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export function Avatar({ name, size = 36 }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.text, { fontSize: size * 0.33 }]}>{initials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 48, gap: 12 },
  message: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 20 },
  avatar: { backgroundColor: '#EEEDFE', alignItems: 'center', justifyContent: 'center' },
  text: { color: '#534AB7', fontWeight: '500' },
});