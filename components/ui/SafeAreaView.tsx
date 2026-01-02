import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Theme';

interface SafeAreaViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export default function SafeAreaView({ children, style, edges }: SafeAreaViewProps) {
  return (
    <RNSafeAreaView style={[styles.container, style]} edges={edges || ['top', 'bottom']}>
      {children}
    </RNSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
