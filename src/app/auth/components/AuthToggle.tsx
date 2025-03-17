import { useState } from 'react';

export default function AuthToggle({ onLogin, onRegister }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-toggle">
      <button
        className={isLogin ? 'active' : ''}
        onClick={() => {
          setIsLogin(true);
          onLogin();
        }}
      >
        Login
      </button>
      <button
        className={!isLogin ? 'active' : ''}
        onClick={() => {
          setIsLogin(false);
          onRegister();
        }}
      >
        Register
      </button>
    </div>
  );
}