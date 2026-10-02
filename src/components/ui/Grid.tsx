import React from 'react';
import { View, useWindowDimensions } from 'react-native';

interface GridProps {
  /** Column count once the viewport is at least `breakpoint` wide. */
  columns?: number;
  /** Column count below `breakpoint`. Defaults to a single stacked column. */
  mobileColumns?: number;
  /** Spacing between items, in px. */
  gutter?: number;
  /** Viewport width at which the grid switches to `columns`. */
  breakpoint?: number;
  children: React.ReactNode;
}

/**
 * React Native has no CSS grid, so this lays children out with flex-wrap.
 * Below `breakpoint` everything stacks in a single column (mobile-first),
 * which is what the original `md:grid-cols-*` classes did.
 *
 * Gutters come from negative container margin + item padding rather than
 * `gap`, so the percentage widths stay exact at every column count.
 */
export function Grid({
  columns = 2,
  mobileColumns = 1,
  gutter = 16,
  breakpoint = 768,
  children,
}: GridProps) {
  const { width } = useWindowDimensions();
  const items = React.Children.toArray(children).filter(Boolean);
  const effectiveColumns = width >= breakpoint ? columns : mobileColumns;

  if (effectiveColumns <= 1) {
    return <View style={{ gap: gutter }}>{items}</View>;
  }

  // A single mobile column keeps the simple stacked layout above; anything
  // wider goes through the flex-wrap grid below.

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -gutter / 2,
        marginBottom: -gutter,
      }}
    >
      {items.map((child, index) => (
        <View
          key={index}
          style={{
            width: `${100 / effectiveColumns}%`,
            paddingHorizontal: gutter / 2,
            marginBottom: gutter,
          }}
        >
          {child}
        </View>
      ))}
    </View>
  );
}
