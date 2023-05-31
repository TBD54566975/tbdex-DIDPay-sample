import React from 'react';
import { useLoaderData } from 'react-router-dom';
import {
  Profile as Web5Profile,
  ProfileApi,
} from '@tbd54566975/web5-user-agent';

export async function loader({ params }: any) {
  const profileApi = new ProfileApi();
  const profile = await profileApi.getProfile(params.profileId);
  return { profile };
}

interface LoaderData {
  profile: Web5Profile | undefined;
}

export default function Profile() {
  const profile = useLoaderData() as LoaderData;

  return <pre>{JSON.stringify(profile, null, 2)}</pre>;
}
