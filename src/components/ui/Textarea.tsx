import React, { forwardRef } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { cn } from '../../lib/utils';
import { colors } from '../../lib/theme';

export interface TextareaProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<TextInput, TextareaProps>(
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
          multiline
          textAlignVertical="top"
          placeholderTextColor={colors.ink.placeholder}
          className={cn(
            'min-h-[80px] w-full rounded-control border border-surface-border bg-white px-3 py-2 text-sm text-ink',
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
Textarea.displayName = 'Textarea';
