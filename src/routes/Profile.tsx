import React, { useContext } from 'react';
import { Web5Context } from '../context/Web5Context';

export default function Profile() {
  const { profile } = useContext(Web5Context);

  return <pre>{JSON.stringify(profile, null, 2)}</pre>;
}
