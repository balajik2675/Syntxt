import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, messageFrom } from '../services/api';
import { ArticleCard } from '../components/Layout';
export function Profile() {
  const { username } = useParams(); const [data, setData] = useState(null); const [error, setError] = useState('');
  useEffect(() => { api.get(`/users/${username}`).then(r => setData(r.data)).catch(e => setError(messageFrom(e))); }, [username]);
  if (error) return <p className="mx-auto max-w-6xl px-5 py-16 text-red-500">{error}</p>;
  if (!data) return <p className="mx-auto max-w-6xl px-5 py-16">Loading...</p>;
  return <div className="mx-auto max-w-6xl px-5 py-14"><div className="rounded-2xl border border-[#e5e7f0] bg-white p-8 dark:border-[#35405a] dark:bg-[#252e43]"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#6575e8] text-2xl font-bold text-white">{data.user.name[0]}</div><h1 className="mt-5 text-3xl font-black">{data.user.name}</h1><p className="text-[#6575e8]">@{data.user.username}</p><p className="mt-4 max-w-xl text-[#62677a] dark:text-[#b9c2d5]">{data.user.bio || 'Sharing ideas with the SYNTXT community.'}</p></div><h2 className="mt-12 text-2xl font-bold">Published stories</h2><div className="mt-6 grid gap-5 md:grid-cols-3">{data.posts.map(post => <ArticleCard key={post._id} post={post}/>)}</div></div>;
}

