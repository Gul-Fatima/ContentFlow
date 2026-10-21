import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Input, type InputProps } from '../ui/Input';
import { iconColor } from '../../lib/theme';

export function PasswordInput(props: InputProps) {
  const [visible, setVisible] = useState(false);
  const label = visible ? 'Hide password' : 'Show password';

  return (
    <View className="relative w-full">
      <Input
        {...props}
        secureTextEntry={!visible}
        className={`${props.className ?? ''} pr-12`}
      />
      <Pressable
        onPress={() => setVisible((value) => !value)}
        accessibilityRole="button"
        accessibilityLabel={label}
        className={`absolute right-0 h-11 w-11 items-center justify-center ${
          props.label ? 'top-6' : 'top-0'
        }`}
      >
        {visible ? (
          <EyeOff size={18} color={iconColor.muted} />
        ) : (
          <Eye size={18} color={iconColor.muted} />
        )}
      </Pressable>
    </View>
  );
}
