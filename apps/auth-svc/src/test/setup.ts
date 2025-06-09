beforeAll(() => {
  process.env.JWT_ACCESS_SECRET = 'asdfasdf';
  process.env.JWT_ACCESS_EXPIRE = '18000000';
  process.env.JWT_REFRESH_SECRET = 'refresh_token';
  process.env.JWT_REFRESH_EXPIRE = '604800000';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
});
