import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: { display: 'none' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          header: () => null,
          tabBarIcon: ({ color }) => (
            <SymbolView
              name="chevron.left.forwardslash.chevron.right"
              tintColor={color}
              size={28}
            />
          ),
          
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          header: () => null,
          tabBarIcon: ({ color }) => (
            <SymbolView
              name="chevron.left.forwardslash.chevron.right"
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
    </Tabs>
  );
}