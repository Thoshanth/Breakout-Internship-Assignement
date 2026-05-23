// src/components/followups/FollowUpCard.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ChannelBadge from '../common/ChannelBadge';
import { fmtTime } from '../../utils/time';

export default function FollowUpCard({ followup }) {
  const [done, setDone] = useState(false);

  return (
    <View style={[styles.card, done && styles.cardDone]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.customer}>{followup.customer_name}</Text>
          <View style={styles.due}>
            <Text style={styles.dueText}>Due at {fmtTime(followup.scheduled_at)} · {followup.delay_minutes}min delay</Text>
          </View>
        </View>
        <ChannelBadge channel={followup.channel} />
      </View>
      <View style={styles.preview}>
        <Text style={styles.previewText} numberOfLines={2}>{followup.message_template || 'No message template set.'}</Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.doneBtn, done && styles.doneBtnDone]}
          onPress={() => !done && setDone(true)}
        >
          <Text style={[styles.doneBtnText, done && styles.doneBtnDoneText]}>
            {done ? '✓ Done' : 'Mark as done'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, marginVertical: 8, borderRadius: 14, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.1)', backgroundColor: '#fff', overflow: 'hidden' },
  cardDone: { opacity: 0.6 },
  header: { padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  customer: { fontSize: 15, fontWeight: '500', color: '#1a1a1a' },
  due: { marginTop: 4 },
  dueText: { fontSize: 13, color: '#666' },
  preview: { marginHorizontal: 14, marginBottom: 10, backgroundColor: '#f5f5f3', borderRadius: 8, padding: 10 },
  previewText: { fontSize: 13, color: '#666', fontStyle: 'italic', lineHeight: 18 },
  footer: { borderTopWidth: 0.5, borderTopColor: 'rgba(0,0,0,0.07)', padding: 12, alignItems: 'flex-end' },
  doneBtn: { backgroundColor: '#EAF3DE', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  doneBtnDone: { backgroundColor: '#D3D1C7' },
  doneBtnText: { fontSize: 13, fontWeight: '500', color: '#3B6D11' },
  doneBtnDoneText: { color: '#5F5E5A' },
});