import { Building2 } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { INDUSTRIES } from '../../constants/industries';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import type { BrandProfile } from '../../services/brand/types';

const INDUSTRY_OPTIONS = INDUSTRIES.map((industry) => ({
  value: industry,
  label: industry,
}));

export function BrandBasicsStep({
  value,
  errors,
  onChange,
  onBlur,
}: {
  value: Partial<BrandProfile>;
  errors: { brandName?: string; industry?: string; website?: string };
  onChange: (field: 'brandName' | 'industry' | 'website', value: string) => void;
  onBlur: (field: 'brandName' | 'website') => void;
}) {
  return (
    <Card padding="none" className="mt-7 gap-5 p-5">
      <View className="flex-row items-center gap-2">
        <Building2 size={16} color="#4F46E5" />
        <Text className="text-sm font-semibold text-ink">Brand Basics</Text>
      </View>
      <View className="gap-4">
        <Input
          label="Brand Name"
          value={value.brandName ?? ''}
          onChangeText={(text) => onChange('brandName', text)}
          onBlur={() => onBlur('brandName')}
          error={errors.brandName}
          placeholder="e.g. Acme Corp"
          autoComplete="organization"
          returnKeyType="next"
          className="h-11 text-base"
        />
        <Select
          label="Industry"
          value={value.industry ?? ''}
          onChange={(industry) => onChange('industry', industry)}
          options={INDUSTRY_OPTIONS}
          placeholder="Select your industry"
          error={errors.industry}
        />
        <Input
          label="Website"
          value={value.website ?? ''}
          onChangeText={(text) => onChange('website', text)}
          onBlur={() => onBlur('website')}
          error={errors.website}
          placeholder="https://yoursite.com"
          keyboardType="url"
          autoCapitalize="none"
          autoComplete="url"
          returnKeyType="done"
          className="h-11 text-base"
        />
      </View>
    </Card>
  );
}
