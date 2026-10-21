import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react-native';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';
import { AuthBrandPanel } from '../src/components/auth/AuthBrandPanel';
import { Logo } from '../src/components/brand/Logo';
import { Button } from '../src/components/ui/Button';
import { FormError } from '../src/components/auth/FormError';
import { BrandBasicsStep } from '../src/components/onboarding/BrandBasicsStep';
import { BrandPurposeStep } from '../src/components/onboarding/BrandPurposeStep';
import { PrimaryGoalsStep } from '../src/components/onboarding/PrimaryGoalsStep';
import { Stepper } from '../src/components/onboarding/Stepper';
import { ROUTES } from '../src/constants/routes';
import { useAuth } from '../src/providers/AuthProvider';
import type { BrandProfile, GoalId } from '../src/services/brand/types';
import { saveBrandProfile } from '../src/services/brand/brandService';
import {
  complete,
  getOnboarding,
  saveDraft,
  skip,
  type OnboardingStep,
} from '../src/services/onboarding/onboardingService';

const INITIAL_PROFILE: Partial<BrandProfile> = { goals: [] };

type FieldErrors = {
  brandName?: string;
  industry?: string;
  website?: string;
  purpose?: string;
};

function normalizeWebsite(value: string | undefined): string | undefined {
  const website = value?.trim();
  if (!website) return undefined;
  if (/^https?:\/\//i.test(website)) return website;
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(website)) return website;
  return `https://${website}`;
}

function isValidWebsite(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      (url.protocol === 'http:' || url.protocol === 'https:') &&
      Boolean(url.hostname)
    );
  } catch {
    return false;
  }
}

function validateBasics(value: Partial<BrandProfile>): FieldErrors {
  const errors: FieldErrors = {};
  const brandName = value.brandName?.trim() ?? '';
  if (brandName.length < 2 || brandName.length > 80) {
    errors.brandName = 'Enter your brand name.';
  }
  if (!value.industry) errors.industry = 'Choose an industry.';

  const website = normalizeWebsite(value.website);
  if (website && !isValidWebsite(website)) {
    errors.website = 'Enter a valid website, e.g. https://yoursite.com.';
  }
  return errors;
}

function normalizeProfile(value: Partial<BrandProfile>): BrandProfile {
  return {
    brandName: value.brandName?.trim() ?? '',
    industry: value.industry ?? '',
    website: normalizeWebsite(value.website),
    purpose: value.purpose?.trim() ?? '',
    goals: value.goals ?? [],
  };
}

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { user } = useAuth();
  const reducedMotion = useReducedMotion();
  const isDesktop = width >= 1024;
  const [step, setStep] = useState<OnboardingStep>(1);
  const [profile, setProfile] =
    useState<Partial<BrandProfile>>(INITIAL_PROFILE);
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [attemptedStep, setAttemptedStep] = useState<OnboardingStep | null>(
    null
  );
  const [touched, setTouched] = useState({
    brandName: false,
    website: false,
    purpose: false,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [loadErrorUserId, setLoadErrorUserId] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    if (!user) {
      router.replace(ROUTES.welcome);
      return;
    }

    let active = true;
    getOnboarding(user.id)
      .then((record) => {
        if (!active) return;
        if (!record || record.status !== 'pending') {
          router.replace(ROUTES.dashboard);
          return;
        }
        setProfile({ ...INITIAL_PROFILE, ...record.draft });
        setStep(record.step);
        setLoadedUserId(user.id);
        setLoadErrorUserId(null);
      })
      .catch((error: unknown) => {
        console.error('Unable to load onboarding state.', error);
        if (!active) return;
        setLoadErrorUserId(user.id);
      });

    return () => {
      active = false;
    };
  }, [loadAttempt, router, user]);

  const basicsErrors = validateBasics(profile);
  const purpose = profile.purpose ?? '';
  const purposeLength = purpose.trim().length;
  const purposeError =
    purposeLength < 10
      ? 'Tell us a bit more (at least 10 characters).'
      : purposeLength > 500
        ? 'Keep your brand purpose to 500 characters or fewer.'
        : undefined;
  const visibleErrors: FieldErrors = {
    brandName:
      touched.brandName || attemptedStep === 1
        ? basicsErrors.brandName
        : undefined,
    industry: attemptedStep === 1 ? basicsErrors.industry : undefined,
    website:
      touched.website || attemptedStep === 1
        ? basicsErrors.website
        : undefined,
    purpose:
      touched.purpose || attemptedStep === 2 ? purposeError : undefined,
  };

  const updateProfile = <K extends keyof BrandProfile>(
    field: K,
    value: BrandProfile[K]
  ) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setFormError(null);
  };

  const persistDraft = useCallback(async (targetStep: OnboardingStep) => {
    if (!user) return;
    const normalized = normalizeProfile(profile);
    await saveDraft(user.id, targetStep, normalized);
    setProfile(normalized);
  }, [profile, user]);

  const goBack = useCallback(async (): Promise<void> => {
    if (!user || step === 1 || submitting) return;
    setFormError(null);
    setSubmitting(true);
    try {
      await persistDraft(step);
      setStep((current) => (current - 1) as OnboardingStep);
      setAttemptedStep(null);
    } catch (error) {
      console.error('Unable to save onboarding progress.', error);
      setFormError('We couldn’t save your progress. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [persistDraft, step, submitting, user]);

  useEffect(() => {
    if (
      Platform.OS !== 'android' ||
      step === 1 ||
      loadedUserId !== user?.id
    ) return;
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        void goBack();
        return true;
      }
    );
    return () => subscription.remove();
  }, [goBack, loadedUserId, step, user?.id]);

  const goNext = async () => {
    if (!user || submitting) return;
    setAttemptedStep(step);
    setFormError(null);

    if (step === 1 && Object.keys(basicsErrors).length > 0) return;
    if (step === 2 && purposeError) return;

    setSubmitting(true);
    try {
      const nextStep = (step + 1) as OnboardingStep;
      await persistDraft(step);
      setStep(nextStep);
      setAttemptedStep(null);
    } catch (error) {
      console.error('Unable to save onboarding progress.', error);
      setFormError('We couldn’t save your progress. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = async () => {
    if (!user || submitting) return;
    setSubmitting(true);
    setFormError(null);
    try {
      await persistDraft(step);
      await skip(user.id);
      router.replace(ROUTES.dashboard);
    } catch (error) {
      console.error('Unable to skip onboarding.', error);
      setFormError('We couldn’t save your progress. Please try again.');
      setSubmitting(false);
    }
  };

  const handleFinish = async () => {
    if (!user || submitting) return;
    setSubmitting(true);
    setFormError(null);
    try {
      const normalized = normalizeProfile(profile);
      await saveDraft(user.id, 3, normalized);
      await saveBrandProfile(user.id, normalized);
      await complete(user.id);
      router.replace(ROUTES.dashboard);
    } catch (error) {
      console.error('Unable to save brand profile during onboarding.', error);
      setFormError(
        "We couldn't save your brand details. Try again, or skip for now."
      );
      setSubmitting(false);
    }
  };

  if (loadedUserId !== user?.id || loadErrorUserId === user?.id) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        {loadErrorUserId === user?.id ? (
          <View className="w-full max-w-md gap-4">
            <FormError>
              We couldn’t load your onboarding progress. Try again.
            </FormError>
            <Button
              variant="secondary"
              onPress={() => {
                setLoadErrorUserId(null);
                setLoadAttempt((attempt) => attempt + 1);
              }}
            >
              Try again
            </Button>
          </View>
        ) : (
          <View className="items-center gap-4">
            <Logo variant="onLight" />
            <ActivityIndicator accessibilityLabel="Loading onboarding progress" />
          </View>
        )}
      </View>
    );
  }

  const stepBody =
    step === 1 ? (
      <BrandBasicsStep
        value={profile}
        errors={visibleErrors}
        onChange={(field, value) => updateProfile(field, value)}
        onBlur={(field) =>
          setTouched((current) => ({ ...current, [field]: true }))
        }
      />
    ) : step === 2 ? (
      <BrandPurposeStep
        value={purpose}
        error={visibleErrors.purpose}
        onChange={(value) => updateProfile('purpose', value)}
        onBlur={() => setTouched((current) => ({ ...current, purpose: true }))}
      />
    ) : (
      <PrimaryGoalsStep
        value={profile.goals ?? []}
        onChange={(goals: GoalId[]) => updateProfile('goals', goals)}
      />
    );

  return (
    <View className={`flex-1 bg-white ${isDesktop ? 'flex-row' : 'flex-col'}`}>
      {isDesktop ? (
        <View style={{ width: Math.min(560, Math.max(420, width * 0.37)) }}>
          <AuthBrandPanel />
        </View>
      ) : null}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="h-full flex-1 bg-white">
          <View
            className="h-16 flex-row items-center justify-between border-b border-surface-border px-5"
            style={{ paddingTop: insets.top }}
          >
            {isDesktop ? (
              <Text className="text-lg font-semibold text-ink">Welcome!</Text>
            ) : (
              <Logo variant="onLight" size="sm" />
            )}
            <Pressable
              onPress={handleSkip}
              disabled={submitting}
              accessibilityRole="button"
              className="min-h-11 justify-center px-2 focus:ring-2 focus:ring-primary-500"
            >
              <Text className="text-sm text-ink-subtle">Skip for now</Text>
            </Pressable>
          </View>

          <View className="py-5">
            <Stepper step={step} />
          </View>
          <View className="h-1 w-full bg-[#E9EBF5]">
            <View
              className="h-1 rounded-full bg-primary-600"
              style={{ width: `${(step * 100) / 3}%` }}
            />
          </View>
          <View className="h-px w-full bg-surface-border" />

          <ScrollView
            className="flex-1"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
              padding: 24,
              paddingBottom: 120,
            }}
          >
            <View className="w-full max-w-[560px]">
              <View className="items-center">
                <View className="h-14 w-14 items-center justify-center rounded-xl bg-primary-100">
                  <Sparkles size={26} color="#4F46E5" />
                </View>
                <Text className="mt-4 text-center text-2xl font-bold text-ink">
                  Tell us about your brand
                </Text>
                <Text className="mt-2 max-w-[420px] text-center text-sm text-ink-subtle">
                  Help our AI understand your brand so it can create content
                  that sounds like you from day one.
                </Text>
              </View>

              {!reducedMotion ? (
                <Animated.View key={step} entering={FadeIn.duration(200)}>
                  {stepBody}
                </Animated.View>
              ) : (
                <View key={step}>{stepBody}</View>
              )}
              {formError ? (
                <View className="mt-4">
                  <FormError>{formError}</FormError>
                </View>
              ) : null}
            </View>
          </ScrollView>

          <View
            className="border-t border-surface-border bg-white px-4 pt-4"
            style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          >
            <View className="mx-auto w-full max-w-[560px] flex-row items-center justify-between">
              {step > 1 ? (
                <Button
                  variant="ghost"
                  onPress={goBack}
                  disabled={submitting}
                  leftIcon={<ArrowLeft size={16} color="#64748B" />}
                >
                  Back
                </Button>
              ) : (
                <View className="h-10" />
              )}
              {step < 3 ? (
                <Button
                  size="md"
                  onPress={goNext}
                  loading={submitting}
                  rightIcon={<ArrowRight size={16} color="#FFFFFF" />}
                >
                  Next
                </Button>
              ) : (
                <Button
                  size="md"
                  onPress={handleFinish}
                  loading={submitting}
                  rightIcon={<Check size={16} color="#FFFFFF" />}
                >
                  Finish setup
                </Button>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
