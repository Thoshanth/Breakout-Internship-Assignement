// src/components/escalations/EscalationCard.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ChannelBadge from '../common/ChannelBadge';
import { Avatar } from '../common/index';
import { fmtTime } from '../../utils/time';

export default function EscalationCard({ enquiry, onViewPress }) {
  const [resolved, setResolved] = useState(false);
  const isHigh = enquiry.urgency === 'high';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.topRow}>
            <Avatar name={enquiry.customer_name} size={30} />
            <Text style={styles.customer}>{enquiry.customer_name}</Text>
            <ChannelBadge channel={enquiry.channel} />
          </View>
          <Text style={styles.reason}>{enquiry.escalation_reason || 'Escalated for review.'}</Text>
          <Text style={styles.time}>{fmtTime(enquiry.created_at)}</Text>
        </View>
        <View style={[styles.urgency, isHigh ? styles.urgencyHigh : styles.urgencyMed]}>
          <Text style={[styles.urgencyText, isHigh ? styles.urgencyHighText : styles.urgencyMedText]}>
            {isHigh ? 'High' : 'Medium'}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.viewBtn} onPress={onViewPress}>
          <Text style={styles.viewBtnText}>View conversation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.resolveBtn, resolved && styles.resolveBtnDone]}
          onPress={() => !resolved && setResolved(true)}
        >
          <Text style={[styles.resolveBtnText, resolved && styles.resolveBtnDoneText]}>
            {resolved ? '✓ Resolved' : 'Resolve'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, marginVertical: 8, borderRadius: 14, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.1)', backgroundColor: '#fff', overflow: 'hidden' },
  header: { padding: 14, flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  headerLeft: { flex: 1 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  customer: { fontSize: 15, fontWeight: '500', color: '#1a1a1a' },
  reason: { fontSize: 13, color: '#666', lineHeight: 18 },
  time: { fontSize: 11, color: '#999', marginTop: 4 },
  urgency: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  urgencyHigh: { backgroundColor: '#FCEBEB' },
  urgencyMed: { backgroundColor: '#FAEEDA' },
  urgencyText: { fontSize: 11, fontWeight: '500' },
  urgencyHighText: { color: '#A32D2D' },
  urgencyMedText: { color: '#854F0B' },
  footer: { borderTopWidth: 0.5, borderTopColor: 'rgba(0,0,0,0.07)', padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewBtn: { padding: 4 },
  viewBtnText: { fontSize: 13, color: '#534AB7', fontWeight: '500' },
  resolveBtn: { backgroundColor: '#EEEDFE', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  resolveBtnDone: { backgroundColor: '#EAF3DE' },
  resolveBtnText: { fontSize: 13, fontWeight: '500', color: '#534AB7' },
  resolveBtnDoneText: { color: '#3B6D11' },
});