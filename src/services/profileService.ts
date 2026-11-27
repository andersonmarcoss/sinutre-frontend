import { api } from '@/lib/api';
import type { Profile, SaveProfilePayload } from '@/types/profile';

export async function getProfile() {
  const response = await api.get<Profile | null>('/profile');
  return response.data;
}

export async function createProfile(payload: SaveProfilePayload) {
  const response = await api.post<Profile>('/profile', payload);
  return response.data;
}