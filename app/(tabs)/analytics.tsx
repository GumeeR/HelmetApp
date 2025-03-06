import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';
import { Battery, Signal, Activity, Clock, Users } from 'lucide-react-native';

const MOCK_DATA = {
  batteryLevels: [85, 45, 95],
  signalStrength: [90, 75, 95],
  activeTime: '12h 30m',
  totalDevices: 3,
  activeDevices: 3,
};

const StatCard = ({ icon: Icon, title, value, color = '#7C3AED', delay = 0 }) => (
  <Animated.View 
    entering={FadeInRight.delay(delay)}
    style={styles.statCard}
  >
    <LinearGradient
      colors={['rgba(124, 58, 237, 0.15)', 'rgba(124, 58, 237, 0.05)']}
      style={styles.statCardGradient}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Icon size={24} color={color} />
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </LinearGradient>
  </Animated.View>
);

export default function AnalyticsScreen() {
  const avgBattery = Math.round(
    MOCK_DATA.batteryLevels.reduce((a, b) => a + b, 0) / MOCK_DATA.batteryLevels.length
  );
  
  const avgSignal = Math.round(
    MOCK_DATA.signalStrength.reduce((a, b) => a + b, 0) / MOCK_DATA.signalStrength.length
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0F1E', '#151B30']}
        style={styles.background}
      />
      
      <Animated.View entering={FadeIn} style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Real-time Performance Metrics</Text>
      </Animated.View>

      <View style={styles.content}>
        <View style={styles.row}>
          <StatCard
            icon={Battery}
            title="Avg Battery"
            value={`${avgBattery}%`}
            color="#22C55E"
            delay={100}
          />
          <StatCard
            icon={Signal}
            title="Avg Signal"
            value={`${avgSignal}%`}
            delay={200}
          />
        </View>

        <View style={styles.row}>
          <StatCard
            icon={Activity}
            title="Usage Today"
            value={MOCK_DATA.activeTime}
            color="#F59E0B"
            delay={300}
          />
          <StatCard
            icon={Users}
            title="Active Devices"
            value={`${MOCK_DATA.activeDevices}/${MOCK_DATA.totalDevices}`}
            color="#3B82F6"
            delay={400}
          />
        </View>

        <Animated.View 
          entering={FadeInRight.delay(500)}
          style={styles.upcomingContainer}
        >
          <LinearGradient
            colors={['rgba(124, 58, 237, 0.15)', 'rgba(124, 58, 237, 0.05)']}
            style={styles.upcomingGradient}
          >
            <View style={styles.upcomingHeader}>
              <Clock size={20} color="#7C3AED" />
              <Text style={styles.upcomingTitle}>Coming Soon</Text>
            </View>
            <Text style={styles.upcomingText}>
              Detailed analytics with historical data, usage patterns, and performance trends will be available in the next update.
            </Text>
          </LinearGradient>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statCardGradient: {
    padding: 20,
    borderRadius: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  upcomingContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  upcomingGradient: {
    padding: 20,
    borderRadius: 16,
  },
  upcomingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  upcomingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  upcomingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    lineHeight: 20,
  },
});