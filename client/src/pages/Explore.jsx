import { useEffect, useState } from 'react';
import { api, messageFrom } from '../services/api';
import { ArticleCard } from '../components/Layout';
export function Explore() {
  const [posts, setPosts] = useState([]); const [search, setSearch] = useState(''); const [error, setError] = useState('');
  async function load(event) { event?.preventDefault(); try { setError(''); const response = await api.get('/posts', { params: { search, limit: 30 } }); setPosts(response.data.posts); } catch (e) { setError(messageFrom(e)); } }
  useEffect(() => { load(); }, []);
  return <div className="mx-auto max-w-6xl px-5 py-14"><h1 className="text-4xl font-black">Explore ideas</h1><form onSubmit={load} className="mt-8 flex max-w-2xl gap-3"><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search articles..." className="min-w-0 flex-1 rounded-xl border border-[#e5e7f0] bg-white px-4 py-3 outline-none focus:border-[#6575e8] dark:border-[#35405a] dark:bg-[#252e43]"/><button className="rounded-xl bg-[#6575e8] px-5 font-semibold text-white">Search</button></form>{error && <p className="mt-4 text-red-500">{error}</p>}<div className="mt-10 grid gap-5 md:grid-cols-3">{posts.map(post => <ArticleCard key={post._id} post={post}/>)}</div>{!posts.length && <p className="mt-10 text-[#62677a]">No published stories found yet.</p>}</div>;
}

