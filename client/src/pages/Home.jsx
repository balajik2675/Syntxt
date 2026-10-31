import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ArticleCard } from '../components/Layout';

export function Home() {
  const [posts, setPosts] = useState([]);
  useEffect(() => { api.get('/posts?limit=6').then(response => setPosts(response.data.posts)).catch(() => {}); }, []);
  return <div><section className="mx-auto max-w-6xl px-5 pb-20 pt-24"><p className="mb-5 font-bold uppercase tracking-[.25em] text-[#6575e8]">Where Ideas Connect.</p><h1 className="max-w-3xl text-5xl font-black leading-tight sm:text-7xl">A home for your <span className="text-[#6575e8]">next thought.</span></h1><p className="mt-6 max-w-xl text-lg text-[#62677a] dark:text-[#b9c2d5]">Read deeply, write freely, and find the people who make ideas move.</p><Link to="/explore" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#6575e8] px-6 py-3 font-semibold text-white">Explore stories <ArrowRight size={18}/></Link></section><section className="mx-auto max-w-6xl px-5"><div className="mb-6 flex items-end justify-between"><h2 className="text-3xl font-bold">Latest stories</h2><Link to="/explore" className="text-sm font-semibold text-[#6575e8]">View all</Link></div><div className="grid gap-5 md:grid-cols-3">{posts.map(post => <ArticleCard key={post._id} post={post}/>)}</div></section></div>;
}

