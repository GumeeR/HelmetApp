import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { Battery, Signal, Plus, Wifi, Shield, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

const MOCK_HELMETS = [
  {
    id: '1',
    name: 'Helmet Alpha',
    battery: 85,
    signal: 90,
    status: 'connected',
    lastSync: '2 min ago',
    image: 'https://images.unsplash.com/photo-1605326152964-54e17f5ad669?w=800&auto=format&fit=crop&q=60',
    alerts: 0,
  },
  {
    id: '2',
    name: 'Helmet Beta',
    battery: 45,
    signal: 75,
    status: 'connected',
    lastSync: '5 min ago',
    image: 'https://images.unsplash.com/photo-1599593752325-ffa41031056e?w=800&auto=format&fit=crop&q=60',
    alerts: 1,
  },
  {
    id: '3',
    name: 'Helmet Gamma',
    battery: 95,
    signal: 95,
    status: 'connected',
    lastSync: '1 min ago',
    image: 'https://images.unsplash.com/photo-1599593752281-7540610a35f3?w=800&auto=format&fit=crop&q=60',
    alerts: 0,
  },
];

const QuickStats = () => (
  <Animated.View 
    entering={FadeInDown.delay(200)}
    style={styles.statsContainer}
  >
    <LinearGradient
      colors={['rgba(124, 58, 237, 0.15)', 'rgba(124, 58, 237, 0.05)']}
      style={styles.statsGradient}
    >
      <View style={styles.statItem}>
        <Wifi size={20} color="#7C3AED" />
        <Text style={styles.statValue}>3</Text>
        <Text style={styles.statLabel}>Connected</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Shield size={20} color="#7C3AED" />
        <Text style={styles.statValue}>100%</Text>
        <Text style={styles.statLabel}>Protected</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <AlertTriangle size={20} color="#7C3AED" />
        <Text style={styles.statValue}>1</Text>
        <Text style={styles.statLabel}>Alert</Text>
      </View>
    </LinearGradient>
  </Animated.View>
);

function HelmetCard({ helmet, index }) {
  const getBatteryColor = (level) => {
    if (level > 60) return '#22C55E';
    if (level > 20) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <Animated.View 
      entering={FadeInUp.delay(index * 100)}
      style={styles.card}
    >
      <LinearGradient
        colors={['rgba(124, 58, 237, 0.1)', 'rgba(124, 58, 237, 0.05)']}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <Image 
            source={{ uri: helmet.image }}
            style={styles.helmetImage}
          />
          <View style={styles.headerContent}>
            <Text style={styles.helmetName}>{helmet.name}</Text>
            <Text style={styles.lastSync}>{helmet.lastSync}</Text>
          </View>
          {helmet.alerts > 0 && (
            <View style={styles.alertBadge}>
              <AlertTriangle size={16} color="#EF4444" />
            </View>
          )}
        </View>
        
        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <Battery size={18} color={getBatteryColor(helmet.battery)} />
            <Text style={[styles.statusText, { color: getBatteryColor(helmet.battery) }]}>
              {helmet.battery}%
            </Text>
          </View>
          <View style={styles.statusItem}>
            <Signal size={18} color="#7C3AED" />
            <Text style={styles.statusText}>{helmet.signal}%</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>
              {helmet.status}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0F1E', '#151B30']}
        style={styles.background}
      />
      
      <Animated.View entering={FadeInDown} style={styles.header}>
        <Text style={styles.title}>Connected Helmets</Text>
        <Text style={styles.subtitle}>{MOCK_HELMETS.length} Active Devices</Text>
      </Animated.View>

      <QuickStats />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {MOCK_HELMETS.map((helmet, index) => (
          <HelmetCard key={helmet.id} helmet={helmet} index={index} />
        ))}
      </ScrollView>

      <BlurView intensity={20} style={styles.fabContainer}>
        <Pressable style={styles.fab}>
          <Plus size={24} color="#fff" />
        </Pressable>
      </BlurView>
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
  statsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statsGradient: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  helmetImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  helmetName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  lastSync: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  alertBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    borderRadius: 12,
    marginLeft: 'auto',
  },
  statusBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#7C3AED',
    textTransform: 'capitalize',
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    borderRadius: 28,
    overflow: 'hidden',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
});