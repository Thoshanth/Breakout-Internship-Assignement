// src/screens/FollowUpsScreen.js
import React from 'react';
import { View, Text, FlatList, SafeAreaView, StyleSheet } from 'react-native';
import { enquiries } from '../mock/enquiries';
import FollowUpCard from '../components/followups/FollowUpCard';
import EmptyState from '../components/common';

export default function FollowUpsScreen() {
  const followups = enquiries.flatMap(e =>
    e.followups.map(fu => ({ ...fu, customer_name: e.customer_name, channel: e.channel }))
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Follow-ups</Text>
        <Text style={styles.sub}>{followups.length} task{followups.length !== 1 ? 's' : ''} scheduled</Text>
      </View>
      <FlatList
        data={followups}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => <FollowUpCard followup={item} />}
        contentContainerStyle={{ paddingVertical: 8 }}
        ListEmptyComponent={<EmptyState icon="calendar-outline" message="No follow-ups scheduled right now." />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f5f3' },
  header: { padding: 16, paddingTop: 12, backgroundColor: '#fff', borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.1)' },
  title: { fontSize: 22, fontWeight: '500' },
  sub: { fontSize: 13, color: '#666', marginTop: 2 },
});