// src/screens/EscalationsScreen.js
import React from 'react';
import { View, Text, FlatList, SafeAreaView, StyleSheet } from 'react-native';
import { enquiries } from '../mock/enquiries';
import EscalationCard from '../components/escalations/EscalationCard';
import EmptyState from '../components/common';

export default function EscalationsScreen({ navigation }) {
  const escalations = enquiries.filter(e => e.status === 'escalated');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Escalations</Text>
        <Text style={styles.sub}>{escalations.length} active alert{escalations.length !== 1 ? 's' : ''} requiring attention</Text>
      </View>
      <FlatList
        data={escalations}
        keyExtractor={e => e.id}
        renderItem={({ item }) => (
          <EscalationCard
            enquiry={item}
            onViewPress={() => navigation.navigate('ConversationDetail', { enquiry: item })}
          />
        )}
        contentContainerStyle={{ paddingVertical: 8 }}
        ListEmptyComponent={<EmptyState icon="checkmark-circle-outline" message="No active escalations. All clear!" />}
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