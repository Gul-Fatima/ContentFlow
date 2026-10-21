import { Star } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { Logo } from '../brand/Logo';
import { BRAND } from '../../constants/brand';
import { AUTH_FEATURES, SHOW_SOCIAL_PROOF } from '../../constants/authPanel';

export function AuthBrandPanel() {
  return (
    <View className="h-full flex-col bg-sidebar p-10">
      <View className="border-b border-white/10 pb-6">
        <Logo variant="onDark" />
        <Text className="mt-3 text-sm text-ink-faint">{BRAND.tagline}</Text>
      </View>

      <View className="mt-20 gap-5">
        {AUTH_FEATURES.map(({ Icon, title, subtitle }) => (
          <View key={title} className="flex-row items-center gap-3">
            <View className="h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-sidebar-card">
              <Icon size={18} color="#A5B4FC" />
            </View>
            <View className="flex-1 gap-1">
              <Text className="text-sm font-medium text-white">{title}</Text>
              <Text className="text-xs text-slate-400">{subtitle}</Text>
            </View>
          </View>
        ))}
      </View>

      {SHOW_SOCIAL_PROOF ? (
        <View className="mt-auto pt-12">
          <View className="rounded-2xl border border-white/10 bg-sidebar-card/60 p-5">
            <Text className="text-sm leading-[22px] text-slate-300">
              IBDA cut our content creation time by 80%. The AI actually
              understands our brand voice - it&apos;s like having an extra team
              member.
            </Text>
            <View className="mt-4 flex-row items-center gap-3">
              <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-500">
                <Text className="text-xs font-semibold text-white">SK</Text>
              </View>
              <View>
                <Text className="text-sm font-medium text-white">Sarah Kim</Text>
                <Text className="text-xs text-slate-500">
                  Head of Marketing, Vercel
                </Text>
              </View>
            </View>
          </View>
          <View className="mt-4 flex-row items-center gap-2">
            <View className="flex-row gap-0.5">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  size={14}
                  color="#FBBF24"
                  fill="transparent"
                />
              ))}
            </View>
            <Text className="text-xs text-slate-500">
              Trusted by 2,000+ teams
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}
