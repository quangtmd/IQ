import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { COMPANY_NAME } from '../constants';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Vui lòng nhập email.');
      return;
    }
    // Password validation can be added here if needed for the mock
    // if (!password.trim()) {
    //   setError('Vui lòng nhập mật khẩu.');
    //   return;
    // }

    const user = await login({ email, password });
    if (user) {
      navigate(from, { replace: true });
    } else {
      setError('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgCanvas py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-bgBase p-10 rounded-xl shadow-xl border border-borderDefault">
        <div>
          <Link to="/" className="flex justify-center">
            <span className="text-3xl font-bold text-primary">{COMPANY_NAME}</span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-textBase">
            Đăng nhập tài khoản
          </h2>
          <p className="mt-2 text-center text-sm text-textMuted">
            Hoặc{' '}
            <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
              đăng ký nếu bạn chưa có tài khoản
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-danger-bg border border-danger-border text-danger-text rounded-md text-sm">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Địa chỉ email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-borderStrong placeholder-textSubtle text-textBase rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Địa chỉ email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                // required  (mock, so password not strictly required for demo)
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-borderStrong placeholder-textSubtle text-textBase rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Mật khẩu (bỏ trống để demo)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-textMuted">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary-dark">
                Quên mật khẩu?
              </a>
            </div>
          </div> */}

          <div>
            <Button type="submit" className="w-full" size="lg" isLoading={authLoading}>
              Đăng nhập
            </Button>
          </div>
        </form>
         <p className="mt-4 text-center text-xs text-textSubtle">
            Lưu ý: Đây là hệ thống demo. Mật khẩu không bắt buộc để đăng nhập.
          </p>
      </div>
    </div>
  );
};

export default LoginPage;
