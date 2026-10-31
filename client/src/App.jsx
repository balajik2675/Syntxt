import { Navigate, Route, Routes } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Auth } from './pages/Auth';
import { Write } from './pages/Write';
import { Edit } from './pages/Edit';
import { Article } from './pages/Article';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';
function Protected({ children }) { const { user, loading } = useApp(); if (loading) return <p className="p-10">Loading...</p>; return user ? children : <Navigate to="/login" replace/>; }
export default function App() { return <Layout><Routes><Route path="/" element={<Home/>}/><Route path="/explore" element={<Explore/>}/><Route path="/login" element={<Auth mode="login"/>}/><Route path="/register" element={<Auth mode="register"/>}/><Route path="/article/:slug" element={<Article/>}/><Route path="/author/:username" element={<Profile/>}/><Route path="/write" element={<Protected><Write/></Protected>}/><Route path="/edit/:id" element={<Protected><Edit/></Protected>}/><Route path="*" element={<NotFound/>}/></Routes></Layout>; }
