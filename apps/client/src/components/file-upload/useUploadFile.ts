import { Api } from '@/lib/generated/core/Api';

export const uploadApi = new Api({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  baseApiParams: {
    credentials: 'include',
  },
});
