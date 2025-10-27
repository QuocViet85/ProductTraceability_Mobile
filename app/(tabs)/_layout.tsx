import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {
             position: 'relative'
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house" color={color} />,
        }}
      />
      <Tabs.Screen
        name="doanhNghiep"
        options={{
          title: 'Doanh Nghiệp',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="business" color={color} />,
        }}
      />
      <Tabs.Screen
        name="quetMa"
        options={{
          title: 'Quét Mã',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="camera" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Hội thoại',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chat" color={color} />,
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: 'Người dùng',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="account-box" color={color} />,
        }}
      />
    </Tabs>
  );
}
