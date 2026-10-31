import { Link } from 'react-router-dom';
export function NotFound() { return <div className="mx-auto max-w-3xl px-5 py-24 text-center"><h1 className="text-6xl font-black text-[#6575e8]">404</h1><p className="mt-4 text-[#62677a]">That page has not been written yet.</p><Link to="/" className="mt-6 inline-block text-[#6575e8]">Return home</Link></div>; }

