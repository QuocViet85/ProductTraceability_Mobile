import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }}/>
          <Stack.Screen name="sanPhamTemplate/chiTietSanPham/index" options={{  headerShown: false }} />
          <Stack.Screen name="sanPhamTemplate/danhSachSanPham/danhSachSanPham" options={{  headerShown: false }} />
          <Stack.Screen name="quetMaTemplate/quetMaBangCamera" options={{  headerShown: false }} />
          <Stack.Screen name="doanhNghiepTemplate/chiTietDoanhNghiep/index" options={{  headerShown: false }} />
          <Stack.Screen name="usertemplate/user/index" options={{  headerShown: false }} />
          <Stack.Screen name="baiVietTemplate/index" options={{  headerShown: false }} />
          <Stack.Screen name="nhaMayTemplate/index" options={{  headerShown: false }} />
          <Stack.Screen name="loSanPhamTemplate/index" options={{  headerShown: false }} />
          <Stack.Screen name="suKienTruyXuatTemplate/index" options={{  headerShown: false }} />
          <Stack.Screen name="chatTemplate/oneChat" options={{  headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
