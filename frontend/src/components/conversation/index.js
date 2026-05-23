// src/components/conversation/MessageBubble.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fmtTime } from '../../utils/time';

const bubbleStyles = {
  customer: { bg: '#f5f5f3', text: '#1a1a1a', align: 'flex-start', radius: { borderBottomLeftRadius: 4 } },
  system:   { bg: '#EEEDFE', text: '#3C3489', align: 'flex-end',   radius: { borderBottomRightRadius: 4 } },
  agent:    { bg: '#EAF3DE', text: '#27500A', align: 'flex-end',   radius: { borderBottomRightRadius: 4 } },
};

export default function MessageBubble({ message }) {
  const style = bubbleStyles[message.sender] || bubbleStyles.system;
  const senderLabel = message.sender === 'customer' ? null : message.sender === 'system' ? 'AI system' : 'Agent';

  return (
    <View style={[styles.wrap, { alignItems: style.align }]}>
      <View style={[styles.bubble, { backgroundColor: style.bg }, style.radius]}>
        <Text style={[styles.content, { color: style.text }]}>{message.content}</Text>
      </View>
      <Text style={styles.meta}>
        {senderLabel ? `${senderLabel} · ` : ''}{fmtTime(message.created_at)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: 4 },
  bubble: { maxWidth: '78%', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10 },
  content: { fontSize: 14, lineHeight: 20 },
  meta: { fontSize: 11, color: '#999', marginTop: 3 },
});


// src/components/conversation/StatusTimeline.js — in same file for brevity
export function StatusTimeline({ events }) {
  const dotColor = { escalation_triggered: '#E24B4A', sop_matched: '#639922' };
  return (
    <View style={tlStyles.container}>
      {events.map((ev, i) => (
        <View key={i} style={tlStyles.item}>
          <View style={[tlStyles.dot, { backgroundColor: dotColor[ev.event_type] || '#7F77DD' }]} />
          <View style={tlStyles.content}>
            <Text style={tlStyles.type}>{ev.event_type.replace(/_/g, ' ')}</Text>
            {ev.detail ? <Text style={tlStyles.detail}>{ev.detail}</Text> : null}
            <Text style={tlStyles.time}>{fmtTime(ev.created_at)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const tlStyles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  item: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 5, flexShrink: 0 },
  content: { flex: 1 },
  type: { fontSize: 13, fontWeight: '500', color: '#1a1a1a', textTransform: 'capitalize' },
  detail: { fontSize: 12, color: '#666', marginTop: 2 },
  time: { fontSize: 11, color: '#999', marginTop: 1 },
});