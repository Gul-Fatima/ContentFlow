import React, { forwardRef } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { cn } from '../../lib/utils';
import { colors } from '../../lib/theme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
  containerClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ className, containerClassName, label, error, ...props }, ref) => {
    return (
      <View className={cn('w-full', containerClassName)}>
        {label ? (
          <Text className="mb-2 text-sm font-medium text-ink-muted">
            {label}
          </Text>
        ) : null}
        <TextInput
          ref={ref}
          placeholderTextColor={colors.ink.placeholder}
          className={cn(
            'h-10 w-full rounded-control border border-surface-border bg-white px-3 text-sm text-ink',
            error && 'border-danger',
            className
          )}
          {...props}
        />
        {error ? (
          <Text className="mt-1 text-xs text-danger">{error}</Text>
        ) : null}
      </View>
    );
  }
);
Input.displayName = 'Input';
