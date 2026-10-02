import React, { forwardRef } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { cn } from '../../lib/utils';

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
          <Text className="mb-2 text-sm font-medium text-slate-700">
            {label}
          </Text>
        ) : null}
        <TextInput
          ref={ref}
          placeholderTextColor="#94A3B8"
          className={cn(
            'h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-brown',
            error && 'border-rose-500',
            className
          )}
          {...props}
        />
        {error ? (
          <Text className="mt-1 text-xs text-rose-500">{error}</Text>
        ) : null}
      </View>
    );
  }
);
Input.displayName = 'Input';
