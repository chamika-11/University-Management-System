import React from 'react';
import { Badge } from '@/components/ui/Badge';

export function WaitlistBadge({ position }) {
  if (position === undefined || position === null) return null;
  return (
    <Badge variant="amber">
      Waitlist #{position}
    </Badge>
  );
}
