import { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onHide: () => void;
  duration?: number;
}

export function Toast({ message, type = 'info', onHide, duration = 3000 }: ToastProps) {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0, {
      damping: 20,
      stiffness: 90,
    });
    opacity.value = withSpring(1);

    const timeout = setTimeout(() => {
      translateY.value = withTiming(100, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 }, () => {
        runOnJS(onHide)();
      });
    }, duration);

    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'rgba(34, 197, 94, 0.9)';
      case 'error':
        return 'rgba(239, 68, 68, 0.9)';
      default:
        return 'rgba(124, 58, 237, 0.9)';
    }
  };

  const ToastContent = () => (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      {Platform.OS === 'web' ? (
        <ToastContent />
      ) : (
        <BlurView intensity={20} style={styles.blurContainer}>
          <ToastContent />
        </BlurView>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1000,
  },
  blurContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});