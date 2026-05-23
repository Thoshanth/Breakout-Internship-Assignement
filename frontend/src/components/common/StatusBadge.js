// src/components/common/StatusBadge.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const config = {
  escalated:   { bg: '#FCEBEB', text: '#A32D2D', label: 'Escalated' },
  sop_matched: { bg: '#EAF3DE', text: '#3B6D11', label: 'Matched' },
  pending:     { bg: '#F1EFE8', text: '#5F5E5A', label: 'Pending' },
  resolved:    { bg: '#EAF3DE', text: '#3B6D11', label: 'Resolved' },
};

export default function StatusBadge({ status }) {
  const c = config[status] || { bg: '#F1EFE8', text: '#5F5E5A', label: status };
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.label, { color: c.text }]}>{c.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  label: { fontSize: 11, fontWeight: '500' },
});