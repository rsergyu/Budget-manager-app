import React, { useState } from 'react';
import { auth, registerWithEmailAndPassword, loginWithEmailAndPassword, signInWithGoogle } from './firebase';
import { FaGoogle, FaEnvelope, FaLock } from 'react-icons/fa';

function Auth({ onAuth, darkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [authType, setAuthType] = useState('login');

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let user;
      if (authType === 'login') {
        user = await loginWithEmailAndPassword(email, password);
      } else if (authType === 'register') {
        user = await registerWithEmailAndPassword(email, password);
      } else if (authType === 'google') {
          user = await signInWithGoogle();
      }

      if (user) {
        onAuth(user);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={`auth-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <h2>{authType === 'login' ? 'Login' : authType === 'register' ? 'Register' : 'Authentication'}</h2>
      {error && <div className="error-message">{error}</div>}
      {authType === 'login' || authType === 'register' ? (
        <form onSubmit={handleAuth}>
          <div className="input-group">
            <label><FaEnvelope /> Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={darkMode ? 'dark-mode' : 'light-mode'}
            />
          </div>
          <div className="input-group">
            <label><FaLock /> Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={darkMode ? 'dark-mode' : 'light-mode'}
            />
          </div>
          <button type="submit">{authType === 'login' ? 'Login' : 'Register'}</button>
        </form>
      ) : null}
      {authType !== 'login' && authType !== 'register' && (
        <button onClick={handleAuth}>
          <FaGoogle /> Sign in with Google
        </button>
      )}
      <div style={{textAlign: 'center', marginTop: '10px'}}>
        {authType !== 'register' && <button onClick={() => setAuthType('register')}>Register</button>}
        {authType !== 'login' && <button onClick={() => setAuthType('login')}>Login</button>}
        <button onClick={() => setAuthType('google')}><FaGoogle /> Sign in with Google</button>
      </div>
    </div>
  );
}

export default Auth;
