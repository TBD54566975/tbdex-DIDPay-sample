import React from 'react';
import { useWeb5Context } from '../../context/Web5Context';

export function ProfilePage() {
  const { profile } = useWeb5Context();

  return <pre>{JSON.stringify(profile, null, 2)}</pre>;
}
