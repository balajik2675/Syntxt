import { Link, useNavigate } from 'react-router-dom';
import { Moon, PenLine, Search, Sun } from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export function Layout({ children }) {
  const { user, setUser, dark, toggleTheme } = useApp();
  const navigate = useNavigate();
  async function logout() { await api.post('/auth/logout'); setUser(null); navigate('/'); }
  return <div className="min-h-screen bg-[#f7f7fc] text-[#20243a] transition-colors dark:bg-[#171d2b] dark:text-white">
    <header className="sticky top-0 z-10 border-b border-[#e5e7f0] bg-white/90 backdrop-blur dark:border-[#35405a] dark:bg-[#171d2b]/90">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="text-xl font-black tracking-[.25em] text-[#6575e8]">SYNTXT</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/explore" className="hidden items-center gap-1 sm:flex"><Search size={16}/> Explore</Link>
          {user ? <><Link to="/write" className="flex items-center gap-1"><PenLine size={16}/> Write</Link><Link to={`/author/${user.username}`}>{user.name}</Link><button onClick={logout}>Log out</button></> : <><Link to="/login">Log in</Link><Link to="/register" className="rounded-full bg-[#6575e8] px-4 py-2 font-semibold text-white">Join</Link></>}
          <button onClick={toggleTheme} aria-label="Toggle theme">{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>
        </div>
      </nav>
    </header>
    <main>{children}</main>
    <footer className="mx-auto mt-20 max-w-6xl border-t border-[#e5e7f0] px-5 py-8 text-sm text-[#62677a] dark:border-[#35405a]">SYNTXT — Where Ideas Connect.</footer>
  </div>;
}

export function ArticleCard({ post }) {
  return <Link to={`/article/${post.slug}`} className="group rounded-2xl border border-[#e5e7f0] bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg dark:border-[#35405a] dark:bg-[#252e43]">
    <div className="mb-5 h-32 rounded-xl bg-gradient-to-br from-[#6575e8] to-[#a5aef7] opacity-90"/>
    <p className="text-xs font-bold uppercase tracking-wider text-[#6575e8]">{post.category}</p>
    <h3 className="mt-2 text-xl font-bold group-hover:text-[#6575e8]">{post.title}</h3>
    <p className="mt-2 line-clamp-2 text-sm text-[#62677a] dark:text-[#b9c2d5]">{post.excerpt}</p>
    <p className="mt-5 text-xs text-[#62677a]">{post.author?.name} · {new Date(post.createdAt).toLocaleDateString()}</p>
  </Link>;
}

