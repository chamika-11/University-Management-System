import React from 'react';
import { Button } from '@/components/ui/Button';

export function EnrollButton({ onEnroll, isEnrolling, isEnrolled, disabled }) {
  if (isEnrolled) {
    return (
      <Button variant="secondary" size="sm" disabled>
        Enrolled
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      size="sm"
      loading={isEnrolling}
      disabled={disabled}
      onClick={onEnroll}
    >
      Enroll Now
    </Button>
  );
}

export default EnrollButton;
