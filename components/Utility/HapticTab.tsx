import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export function HapticTab(props: BottomTabBarButtonProps) {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        // Provide haptic feedback on both iOS and Android
        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else if (Platform.OS === 'android') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        
        // Visual feedback - slight scale down
        scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
        
        props.onPressIn?.(ev);
      }}
      onPressOut={(ev) => {
        // Return to normal scale
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
        
        props.onPressOut?.(ev);
      }}>
      <Animated.View style={animatedStyle}>
        {props.children}
      </Animated.View>
    </PlatformPressable>
  );
}
