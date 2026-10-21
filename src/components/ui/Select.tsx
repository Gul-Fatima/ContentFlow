import { useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, ChevronDown } from 'lucide-react-native';
import { colors, iconColor, palette } from '../../lib/theme';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  error?: string;
}

export function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width < 768;
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open || Platform.OS !== 'web') return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <View className="w-full gap-1.5">
      {label ? (
        <Text className="text-sm font-medium text-ink-muted">{label}</Text>
      ) : null}
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="combobox"
        accessibilityLabel={label}
        accessibilityValue={{ text: selected?.label ?? placeholder }}
        accessibilityState={{ expanded: open }}
        className={`h-11 w-full flex-row items-center justify-between rounded-control border bg-white px-3 focus:ring-2 focus:ring-primary-500 ${
          error ? 'border-danger' : 'border-surface-border'
        }`}
      >
        <Text
          className={`flex-1 text-base ${
            selected ? 'text-ink' : 'text-ink-faint'
          }`}
        >
          {selected?.label ?? placeholder}
        </Text>
        <ChevronDown size={18} color={iconColor.muted} />
      </Pressable>
      {error ? <Text className="text-xs text-danger-text">{error}</Text> : null}

      <Modal
        visible={open}
        transparent
        animationType={isMobile ? 'slide' : 'fade'}
        onRequestClose={close}
      >
        <View
          className={`flex-1 justify-center bg-black/40 ${
            isMobile ? 'justify-end' : 'items-center px-6'
          }`}
        >
          <Pressable
            className="absolute inset-0"
            accessibilityRole="button"
            accessibilityLabel="Close options"
            onPress={close}
          />
          <View
            className={`w-full overflow-hidden border border-surface-border bg-white ${
              isMobile ? 'max-h-[70%] rounded-t-2xl' : 'max-w-[360px] rounded-2xl'
            }`}
            style={
              isMobile
                ? { paddingBottom: Math.max(insets.bottom, 16) }
                : undefined
            }
          >
            {label ? (
              <Text className="border-b border-surface-border px-4 py-4 text-base font-semibold text-ink">
                {label}
              </Text>
            ) : null}
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingVertical: 4 }}
            >
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      onChange(option.value);
                      close();
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    className={`h-12 flex-row items-center justify-between px-4 ${
                      isSelected ? 'bg-primary-50' : 'active:bg-surface-muted'
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        isSelected
                          ? 'font-medium text-primary-700'
                          : 'text-ink'
                      }`}
                    >
                      {option.label}
                    </Text>
                    {isSelected ? (
                      <Check size={18} color={colors.primary[600] ?? palette.white} />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
