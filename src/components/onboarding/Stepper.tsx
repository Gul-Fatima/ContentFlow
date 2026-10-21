import { Check } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { palette } from '../../lib/theme';
import type { OnboardingStep } from '../../services/onboarding/onboardingService';

const STEPS = ['Brand Basics', 'Brand Purpose', 'Primary Goals'] as const;

export function Stepper({ step }: { step: OnboardingStep }) {
  return (
    <View
      className="w-full max-w-[560px] self-center px-6"
      accessibilityLabel={`Step ${step} of 3: ${STEPS[step - 1]}, current`}
    >
      <View className="flex-row items-start">
        {STEPS.map((label, index) => {
          const number = index + 1;
          const done = number < step;
          const active = number === step;

          return (
            <View
              key={label}
              className="flex-1 flex-row items-start"
              accessible={false}
            >
              <View className="items-center">
                <View
                  className={`h-8 w-8 items-center justify-center rounded-full ${
                    done
                      ? 'bg-success'
                      : active
                        ? 'bg-primary-600'
                        : 'border border-surface-border bg-white'
                  }`}
                >
                  {done ? (
                    <Check size={16} color={palette.white} />
                  ) : (
                    <Text
                      className={`text-sm font-semibold ${
                        active ? 'text-white' : 'text-ink-faint'
                      }`}
                    >
                      {number}
                    </Text>
                  )}
                </View>
                <Text
                  className={`mt-1 text-center text-caption ${
                    done
                      ? 'text-success-text'
                      : active
                        ? 'font-medium text-primary-600'
                        : 'text-ink-faint'
                  }`}
                >
                  {label}
                </Text>
              </View>
              {number < 3 ? (
                <View
                  className={`mt-[15px] h-0.5 flex-1 ${
                    number < step ? 'bg-success' : 'bg-surface-border'
                  }`}
                />
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}
