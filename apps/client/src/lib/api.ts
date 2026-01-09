import { Api as AuthApiClass } from './generated/auth/Api'; // Đổi tên Api của Auth
import { Api as CoreApiClass } from './generated/core/Api'; // Đổi tên Api của Core

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const BASE_PARAMS = {
  credentials: 'include' as const, // Thêm 'as const' để kiểu hóa chính xác hơn
  headers: {
    'Content-Type': 'application/json',
  },
};

export const authApi = new AuthApiClass({
  baseUrl: BASE_URL,
  baseApiParams: BASE_PARAMS,
});

export const coreApi = new CoreApiClass({
  baseUrl: BASE_URL,
  baseApiParams: BASE_PARAMS,
});
