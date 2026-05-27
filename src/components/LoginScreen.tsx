import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: signErr } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (signErr) {
      setError('Sai email hoặc mật khẩu.');
    }
    setBusy(false);
  };

  return (
    <div className="mx-auto flex min-h-full max-w-sm flex-col justify-center px-6 py-10">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <h1 className="mb-1 text-xl font-bold text-stone-900">🥖 Tính tiền lò bánh mì</h1>
        <p className="mb-5 text-sm text-stone-600">Đăng nhập để đồng bộ giữa các điện thoại.</p>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-semibold text-stone-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="w-full rounded-lg border border-stone-300 bg-white p-3 text-base focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-stone-600">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-stone-300 bg-white p-3 text-base focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          )}
          <button
            type="submit"
            disabled={busy}
            className="h-12 w-full rounded-xl bg-brand-500 text-base font-bold text-white shadow-sm active:bg-brand-600 disabled:bg-stone-300"
          >
            {busy ? 'Đang vào...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}
