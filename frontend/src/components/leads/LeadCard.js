// src/components/leads/LeadCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ChannelBadge from '../common/ChannelBadge';
import StatusBadge from '../common/StatusBadge';
import { Avatar } from '../common/index';
import { fmtTime } from '../../utils/time';

export default function LeadCard({ enquiry, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Avatar name={enquiry.customer_name} />
      <View style={styles.info}>
        <Text style={styles.name}>{enquiry.customer_name}</Text>
        <Text style={styles.msg} numberOfLines={1}>{enquiry.messages[0].content}</Text>
        <View style={styles.meta}>
          <ChannelBadge channel={enquiry.channel} />
          <StatusBadge status={enquiry.status} />
          {enquiry.sop_matched && enquiry.sop_matched !== 'unmatched' && (
            <View style={styles.sopBadge}>
              <Text style={styles.sopText}>SOP: {enquiry.sop_matched}</Text>
            </View>
          )}
          <Text style={styles.time}>{fmtTime(enquiry.created_at)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 14, paddingHorizontal: 16, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.07)', gap: 10, alignItems: 'flex-start' },
  info: { flex: 1, minWidth: 0 },
  name: { fontSize: 15, fontWeight: '500', color: '#1a1a1a' },
  msg: { fontSize: 13, color: '#666', marginTop: 3 },
  meta: { flexDirection: 'row', gap: 6, marginTop: 6, alignItems: 'center', flexWrap: 'wrap' },
  time: { fontSize: 11, color: '#999' },
  sopBadge: { backgroundColor: '#EAF3DE', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  sopText: { fontSize: 11, fontWeight: '500', color: '#3B6D11' },
});