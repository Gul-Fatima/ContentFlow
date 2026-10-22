import { useEffect, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { colors, iconColor } from '../../lib/theme';

export interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  accessibilityLabel?: string;
  onSubmit?: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder,
  accessibilityLabel,
  onSubmit,
}: SearchBarProps) {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && value) {
        onChangeText('');
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onChangeText, value]);

  const handleSubmit: TextInputProps['onSubmitEditing'] = () => onSubmit?.();

  return (
    <View
      accessibilityRole="search"
      className={`h-11 w-full flex-row items-center rounded-control border bg-white px-3 ${
        focused ? 'border-primary-500' : 'border-surface-border'
      }`}
    >
      <Search size={18} color={iconColor.muted} />
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onSubmitEditing={handleSubmit}
        placeholder={placeholder}
        placeholderTextColor={colors.ink.placeholder}
        accessibilityLabel={accessibilityLabel ?? placeholder}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never"
        className="h-full min-w-0 flex-1 px-3 text-base text-ink outline-none"
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => {
            onChangeText('');
            inputRef.current?.focus();
          }}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          className="h-11 w-11 items-center justify-center"
        >
          <X size={16} color={iconColor.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}
