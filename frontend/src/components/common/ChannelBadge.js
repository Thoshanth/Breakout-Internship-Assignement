// src/components/common/ChannelBadge.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const config = {
  whatsapp: { bg: '#E6F8ED', text: '#0E7A3D', label: 'WhatsApp' },
  email:    { bg: '#E6F1FB', text: '#0A5A9E', label: 'Email' },
  call:     { bg: '#FAEEDA', text: '#854F0B', label: 'Call' },
};

export default function ChannelBadge({ channel }) {
  const norm = (channel || '').toLowerCase();
  const c = config[norm] || { bg: '#F1EFE8', text: '#5F5E5A', label: channel };
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
