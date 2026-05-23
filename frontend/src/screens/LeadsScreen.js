// src/screens/LeadsScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { enquiries } from '../mock/enquiries';
import LeadCard from '../components/leads/LeadCard';
import EmptyState from '../components/common';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'sop_matched', label: 'Matched' },
  { key: 'escalated', label: 'Escalated' },
  { key: 'pending', label: 'Pending' },
];

export default function LeadsScreen({ navigation }) {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? enquiries : enquiries.filter(e => e.status === filter);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Leads</Text>
        <Text style={styles.sub}>{enquiries.length} inbound enquiries today</Text>
      </View>
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity key={f.key} style={[styles.chip, filter === f.key && styles.chipActive]} onPress={() => setFilter(f.key)}>
            <Text style={[styles.chipText, filter === f.key && styles.chipTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={e => e.id}
        renderItem={({ item }) => (
          <LeadCard enquiry={item} onPress={() => navigation.navigate('ConversationDetail', { enquiry: item })} />
        )}
        ListEmptyComponent={<EmptyState icon="inbox-outline" message="No leads match this filter yet." />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, paddingTop: 12, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.1)' },
  title: { fontSize: 22, fontWeight: '500' },
  sub: { fontSize: 13, color: '#666', marginTop: 2 },
  filterRow: { flexDirection: 'row', gap: 8, padding: 10, paddingHorizontal: 16, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.07)' },
  chip: { borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.18)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#EEEDFE', borderColor: '#AFA9EC' },
  chipText: { fontSize: 12, fontWeight: '500', color: '#666' },
  chipTextActive: { color: '#534AB7' },
});