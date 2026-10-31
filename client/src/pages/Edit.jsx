import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from '../components/Editor';
import { api, messageFrom } from '../services/api';

export function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api.get(`/posts/${id}`).then(({ data }) => setForm({ ...data.post, tags: data.post.tags.join(', ') })).catch(error => setError(messageFrom(error))); }, [id]);
  if (error) return <p className="mx-auto max-w-3xl px-5 py-16 text-red-500">{error}</p>;
  if (!form) return <p className="p-10">Loading...</p>;
  const change = (key, value) => setForm(current => ({ ...current, [key]: value }));
  async function save(status = form.status) {
    try {
      const response = await api.put(`/posts/${id}`, { ...form, status, tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean) });
      navigate(`/article/${response.data.post.slug}`);
    } catch (requestError) { setError(messageFrom(requestError)); }
  }
  return <div className="mx-auto max-w-4xl px-5 py-12"><h1 className="text-4xl font-black">Edit article</h1><div className="mt-8 space-y-4"><input value={form.title} onChange={event => change('title', event.target.value)} className="w-full bg-transparent text-4xl font-bold outline-none"/><textarea value={form.excerpt} onChange={event => change('excerpt', event.target.value)} className="w-full rounded-xl border border-[#e5e7f0] bg-white p-4 dark:border-[#35405a] dark:bg-[#252e43]"/><div className="grid gap-4 sm:grid-cols-2"><input value={form.category} onChange={event => change('category', event.target.value)} className="rounded-xl border border-[#e5e7f0] bg-white p-3 dark:border-[#35405a] dark:bg-[#252e43]"/><input value={form.tags} onChange={event => change('tags', event.target.value)} className="rounded-xl border border-[#e5e7f0] bg-white p-3 dark:border-[#35405a] dark:bg-[#252e43]"/></div><Editor value={form.content} onChange={value => change('content', value)}/>{error && <p className="text-red-500">{error}</p>}<div className="flex justify-end gap-3"><button onClick={() => save('draft')} className="rounded-xl border border-[#e5e7f0] px-5 py-3 dark:border-[#35405a]">Save draft</button><button onClick={() => save('published')} className="rounded-xl bg-[#6575e8] px-5 py-3 font-semibold text-white">Update</button></div></div></div>;
}
