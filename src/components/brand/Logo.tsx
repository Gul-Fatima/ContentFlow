import { Image, Text, View } from 'react-native';
import { Megaphone } from 'lucide-react-native';
import { BRAND, WORDMARK_IMAGE } from '../../constants/brand';
import { cn } from '../../lib/utils';

export interface LogoProps {
  variant: 'onDark' | 'onLight';
  /** Hide the wordmark text (collapsed sidebar). */
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const tileSizes = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-16 w-16 rounded-2xl',
} as const;
const iconSizes = { sm: 18, md: 22, lg: 36 } as const;
const wordmarkHeights = { sm: 20, md: 24, lg: 36 } as const;

/** Brand tile (40x40, or 32x32 when `sm`) plus the IBDA wordmark. */
export function Logo({ variant, iconOnly, size = 'md' }: LogoProps) {
  return (
    <View className="flex-row items-center gap-2">
      <View
        className={cn(
          'items-center justify-center rounded-xl bg-primary-600',
          tileSizes[size]
        )}
      >
        <Megaphone size={iconSizes[size]} color="#FFFFFF" />
      </View>
      {!iconOnly &&
        (WORDMARK_IMAGE ? (
          <Image
            source={WORDMARK_IMAGE}
            resizeMode="contain"
            style={{ height: wordmarkHeights[size] }}
          />
        ) : (
          <Text
            className={cn(
              size === 'lg'
                ? 'text-3xl font-bold tracking-wide'
                : 'text-lg font-bold tracking-wide',
              variant === 'onDark' ? 'text-white' : 'text-ink'
            )}
          >
            {BRAND.name}
          </Text>
        ))}
    </View>
  );
}
