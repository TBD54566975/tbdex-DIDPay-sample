import React from 'react';
import { useWeb5Context } from '../context/Web5Context';

export default function Profile() {
  const { profile } = useWeb5Context();

  return <pre>{JSON.stringify(profile, null, 2)}</pre>;
}
