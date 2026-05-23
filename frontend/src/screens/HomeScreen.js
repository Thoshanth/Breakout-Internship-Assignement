// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { enquiries, dashboardStats } from '../mock/enquiries';
import ChannelBadge from '../components/common/ChannelBadge';
import StatusBadge from '../components/common/StatusBadge';
import { Avatar } from '../components/common/index';
import { fmtTime } from '../utils/time';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Good morning 👋</Text>
        <Text style={styles.sub}>Closira dashboard · Today</Text>
      </View>
      <ScrollView>
        <View style={styles.statGrid}>
          {[
            { label: 'Total leads today',  val: dashboardStats.total_leads_today,  accent: true },
            { label: 'Missed enquiries',   val: dashboardStats.missed_enquiries,   accent: false },
            { label: 'Open escalations',   val: dashboardStats.open_escalations,   accent: false, danger: true },
            { label: 'Follow-ups due',     val: dashboardStats.followups_due,      accent: false, warn: true },
          ].map(s => (
            <View key={s.label} style={[styles.statCard, s.accent && styles.statCardAccent]}>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={[styles.statVal, s.danger && { color: '#A32D2D' }, s.warn && { color: '#854F0B' }, s.accent && { color: '#534AB7' }]}>{s.val}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.quickActions}>
          {[
            { label: 'Escalations', screen: 'Escalations' },
            { label: 'Follow-ups',  screen: 'Follow-ups' },
            { label: 'All leads',   screen: 'Leads' },
          ].map(a => (
            <TouchableOpacity key={a.label} style={styles.qaBtn} onPress={() => navigation.navigate(a.screen)}>
              <Text style={styles.qaBtnText}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Recent activity</Text>
        {enquiries.map(e => (
          <TouchableOpacity key={e.id} style={styles.actItem} onPress={() => navigation.navigate('Leads', { screen: 'ConversationDetail', params: { enquiry: e } })}>
            <Avatar name={e.customer_name} />
            <View style={styles.actInfo}>
              <Text style={styles.actName}>{e.customer_name}</Text>
              <Text style={styles.actMsg} numberOfLines={1}>{e.messages[0].content}</Text>
              <View style={styles.actMeta}>
                <ChannelBadge channel={e.channel} />
                <StatusBadge status={e.status} />
                <Text style={styles.time}>{fmtTime(e.created_at)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, paddingTop: 12, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.1)' },
  title: { fontSize: 22, fontWeight: '500' },
  sub: { fontSize: 13, color: '#666', marginTop: 2 },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 16, paddingBottom: 8 },
  statCard: { width: '47%', backgroundColor: '#f5f5f3', borderRadius: 14, padding: 14 },
  statCardAccent: { backgroundColor: '#EEEDFE' },
  statLabel: { fontSize: 12, color: '#666', marginBottom: 6 },
  statVal: { fontSize: 28, fontWeight: '500' },
  sectionTitle: { fontSize: 12, fontWeight: '500', color: '#888', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 },
  quickActions: { flexDirection: 'row', gap: 8, paddingHorizontal: 16 },
  qaBtn: { flex: 1, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: 12, alignItems: 'center', backgroundColor: '#fff' },
  qaBtnText: { fontSize: 12, fontWeight: '500' },
  actItem: { flexDirection: 'row', padding: 14, paddingHorizontal: 16, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.07)', gap: 10, alignItems: 'flex-start' },
  actInfo: { flex: 1, minWidth: 0 },
  actName: { fontSize: 14, fontWeight: '500' },
  actMsg: { fontSize: 13, color: '#666', marginTop: 2 },
  actMeta: { flexDirection: 'row', gap: 6, marginTop: 5, alignItems: 'center', flexWrap: 'wrap' },
  time: { fontSize: 11, color: '#999' },
});