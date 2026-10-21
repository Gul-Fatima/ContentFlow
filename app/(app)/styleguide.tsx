import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Calendar, Sparkles } from 'lucide-react-native';
import { Avatar } from '../../src/components/ui/Avatar';
import { Badge, type BadgeVariant } from '../../src/components/ui/Badge';
import { Button, type ButtonSize, type ButtonVariant } from '../../src/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardPadding,
} from '../../src/components/ui/Card';
import { IconTile, iconTileColor } from '../../src/components/ui/IconTile';
import { Input } from '../../src/components/ui/Input';
import { PageHeader } from '../../src/components/ui/PageHeader';
import { StatCard } from '../../src/components/ui/StatCard';
import { Tabs } from '../../src/components/ui/Tabs';
import { Textarea } from '../../src/components/ui/Textarea';

const BUTTON_VARIANTS: ButtonVariant[] = [
  'primary',
  'secondary',
  'ghost',
  'danger',
  'success',
];
const BUTTON_SIZES: ButtonSize[] = ['sm', 'md', 'lg', 'icon'];
const BADGE_VARIANTS: BadgeVariant[] = [
  'neutral',
  'primary',
  'success',
  'danger',
  'warning',
  'outline',
  'count',
];
const CARD_PADDINGS: CardPadding[] = ['none', 'sm', 'md', 'lg'];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-3">
      <Text className="text-lg font-bold text-ink">{title}</Text>
      {children}
    </View>
  );
}

function StyleguideContent() {
  const [tab, setTab] = useState('one');

  return (
    <View className="gap-8 p-4 pb-16 md:p-8">
      <PageHeader
        title="Styleguide"
        description="Every shared component variant. Dev only — not in the sidebar."
        actions={
          <Button variant="secondary" leftIcon={<Sparkles size={16} />}>
            Action
          </Button>
        }
      />

      <Section title="Button — variant × size">
        <View className="gap-3">
          {BUTTON_VARIANTS.map((variant) => (
            <View key={variant} className="flex-row flex-wrap items-center gap-3">
              {BUTTON_SIZES.map((size) =>
                size === 'icon' ? (
                  <Button key={size} variant={variant} size={size}>
                    <Calendar size={18} />
                  </Button>
                ) : (
                  <Button key={size} variant={variant} size={size}>
                    {variant}
                  </Button>
                )
              )}
            </View>
          ))}
          <View className="flex-row flex-wrap items-center gap-3">
            <Button fullWidth>fullWidth</Button>
            <Button loading>loading</Button>
            <Button disabled>disabled</Button>
            <Button
              variant="primary"
              leftIcon={<Sparkles size={16} />}
              rightIcon={<Sparkles size={16} />}
            >
              with icons
            </Button>
          </View>
        </View>
      </Section>

      <Section title="Badge — variants">
        <View className="flex-row flex-wrap items-center gap-3">
          {BADGE_VARIANTS.map((variant) => (
            <Badge key={variant} variant={variant}>
              {variant === 'count' ? '8' : variant}
            </Badge>
          ))}
        </View>
      </Section>

      <Section title="Card — paddings">
        <View className="flex-row flex-wrap gap-4">
          {CARD_PADDINGS.map((padding) => (
            <Card key={padding} padding={padding} className="flex-1">
              <CardHeader>
                <CardTitle>padding: {padding}</CardTitle>
                <CardDescription>CardHeader + CardContent.</CardDescription>
              </CardHeader>
              <CardContent>
                <Text className="text-sm text-ink-muted">CardContent</Text>
              </CardContent>
              <CardFooter>
                <Button size="sm">CardFooter</Button>
              </CardFooter>
            </Card>
          ))}
        </View>
      </Section>

      <Section title="Tabs">
        <Tabs
          items={[
            { key: 'one', label: 'First' },
            { key: 'two', label: 'Second', count: 3 },
            { key: 'three', label: 'A much longer third tab label' },
          ]}
          value={tab}
          onChange={setTab}
        />
      </Section>

      <Section title="Input / Textarea">
        <View className="max-w-md gap-4">
          <Input label="Label" placeholder="Placeholder" />
          <Input label="With error" placeholder="Placeholder" error="Something went wrong" />
          <Textarea label="Textarea" placeholder="Placeholder" />
          <Textarea label="Textarea error" placeholder="Placeholder" error="Something went wrong" />
        </View>
      </Section>

      <Section title="IconTile / Avatar">
        <View className="flex-row items-center gap-4">
          {(['primary', 'warning', 'success', 'danger'] as const).map((tone) => (
            <IconTile
              key={tone}
              tone={tone}
              icon={<Sparkles size={22} color={iconTileColor(tone)} />}
            />
          ))}
          <Avatar fallback="AM" size="sm" showStatus={false} />
          <Avatar fallback="AM" />
          <Avatar fallback="AM" size="lg" />
        </View>
      </Section>

      <Section title="StatCard">
        <View className="flex-col gap-4 md:flex-row">
          <StatCard
            label="Scheduled"
            value="28"
            tone="primary"
            icon={<Calendar size={24} color={iconTileColor('primary')} />}
          />
          <StatCard
            label="Drafts"
            value="4"
            tone="warning"
            icon={<Calendar size={24} color={iconTileColor('warning')} />}
          />
          <StatCard
            label="Reach"
            value="45.2k"
            tone="success"
            icon={<Calendar size={24} color={iconTileColor('success')} />}
          />
          <StatCard
            label="At risk"
            value="2"
            tone="danger"
            icon={<Calendar size={24} color={iconTileColor('danger')} />}
          />
        </View>
      </Section>

      <Section title="PageHeader">
        <PageHeader
          title="Page title"
          description="Description text in text-sm text-ink-subtle."
          actions={<Button size="sm">New item</Button>}
        />
      </Section>
    </View>
  );
}

export default function StyleguideScreen() {
  if (!__DEV__) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-sm text-ink-subtle">Not available</Text>
      </View>
    );
  }
  return <StyleguideContent />;
}
