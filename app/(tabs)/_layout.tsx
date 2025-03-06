import { Tabs } from 'expo-router';
import { Chrome as Home, Settings, Activity } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0A0F1E',
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 8,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['rgba(10, 15, 30, 0.8)', '#0A0F1E']}
            style={{ height: '100%' }}
          />
        ),
        tabBarActiveTintColor: '#7C3AED',
        tabBarInactiveTintColor: '#6B7280',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Helmets',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, size }) => <Activity size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}