import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { Plus, LayoutDashboard, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const { data } = await api.get('/boards');
      setBoards(data);
    } catch (error) {
      console.error('Failed to fetch boards');
    }
  };

  const createBoard = async (e) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    try {
      const { data } = await api.post('/boards', { name: newBoardName });
      setBoards([...boards, data]);
      setNewBoardName('');
      setIsCreating(false);
      navigate(`/board/${data._id}`);
    } catch (error) {
      console.error('Failed to create board');
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-bg overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="px-8 py-6 flex justify-between items-center border-b border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400">Welcome back, {user?.name}</p>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            New Board
          </button>
        </header>

        <main className="flex-1 p-8">
          {isCreating && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 glass-panel rounded-xl max-w-md"
            >
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Create New Board</h2>
              <form onSubmit={createBoard} className="flex gap-3">
                <input 
                  type="text" 
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  placeholder="Board Name" 
                  className="input-field flex-1"
                  autoFocus
                />
                <button type="submit" className="btn-primary">Create</button>
                <button type="button" onClick={() => setIsCreating(false)} className="btn-secondary">Cancel</button>
              </form>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                key={board._id}
              >
                <Link 
                  to={`/board/${board._id}`}
                  className="block p-6 glass-panel rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <LayoutDashboard className="text-brand-600 dark:text-brand-400" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{board.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{board.columns?.length || 3} columns</p>
                </Link>
              </motion.div>
            ))}
            
            {boards.length === 0 && !isCreating && (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-300 dark:border-dark-border rounded-xl">
                <LayoutDashboard className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No boards yet</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">Create a board to get started tracking your tasks.</p>
                <button onClick={() => setIsCreating(true)} className="btn-secondary">
                  Create First Board
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
