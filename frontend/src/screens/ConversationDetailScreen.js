// src/screens/ConversationDetailScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MessageBubble, { StatusTimeline } from '../components/conversation/index';
import ChannelBadge from '../components/common/ChannelBadge';
import StatusBadge from '../components/common/StatusBadge';

export default function ConversationDetailScreen({ route, navigation }) {
  const { enquiry } = route.params;
  const isUnmatched = !enquiry.sop_matched || enquiry.sop_matched === 'unmatched';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#534AB7" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>{enquiry.customer_name}</Text>
          <View style={styles.subRow}>
            <ChannelBadge channel={enquiry.channel} />
            <StatusBadge status={enquiry.status} />
          </View>
        </View>
      </View>

      <ScrollView>
        <View style={[styles.sopBanner, isUnmatched && styles.sopBannerDanger]}>
          <Ionicons
            name={isUnmatched ? 'alert-circle-outline' : 'hardware-chip-outline'}
            size={16}
            color={isUnmatched ? '#A32D2D' : '#534AB7'}
          />
          <Text style={[styles.sopText, isUnmatched && styles.sopTextDanger]}>
            {isUnmatched ? 'No SOP matched — auto-escalated' : `SOP matched: ${enquiry.sop_matched}`}
          </Text>
        </View>

        {enquiry.suggested_response && (
          <View style={styles.aiSummary}>
            <Text style={styles.aiLabel}>AI SUMMARY</Text>
            <Text style={styles.aiText}>{enquiry.suggested_response}</Text>
          </View>
        )}

        <View style={styles.messages}>
          {enquiry.messages.map(m => (
            <MessageBubble key={m.id} message={m} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Status timeline</Text>
        <StatusTimeline events={enquiry.events} />
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 14, paddingTop: 10, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.1)', flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { fontSize: 14, fontWeight: '500', color: '#534AB7' },
  title: { fontSize: 16, fontWeight: '500' },
  subRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  sopBanner: { margin: 12, backgroundColor: '#EEEDFE', borderRadius: 10, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  sopBannerDanger: { backgroundColor: '#FCEBEB' },
  sopText: { fontSize: 13, color: '#3C3489', flex: 1 },
  sopTextDanger: { color: '#A32D2D' },
  aiSummary: { marginHorizontal: 12, marginBottom: 10, backgroundColor: '#F1EFE8', borderRadius: 10, padding: 12 },
  aiLabel: { fontSize: 10, color: '#5F5E5A', fontWeight: '500', letterSpacing: 0.8, marginBottom: 4 },
  aiText: { fontSize: 13, color: '#444', lineHeight: 18 },
  messages: { padding: 12, gap: 8 },
  sectionTitle: { fontSize: 12, fontWeight: '500', color: '#888', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8, borderTopWidth: 0.5, borderTopColor: 'rgba(0,0,0,0.07)' },
});