import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { Clock, Archive, RotateCcw, Trash2 } from 'lucide-react';

const History = () => {
  const { user } = useAuth();
  const [historyTasks, setHistoryTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/tasks/history');
      setHistoryTasks(data);
    } catch (error) {
      console.error('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (task) => {
    try {
      // Soft undelete / restore
      await api.put(`/tasks/${task._id}`, { isDeleted: false });
      setHistoryTasks(historyTasks.filter(t => t._id !== task._id));
    } catch (error) {
      console.error('Failed to restore task');
    }
  };

  const handlePermanentDelete = async (task) => {
    try {
      await api.delete(`/tasks/${task._id}/permanent`);
      setHistoryTasks(historyTasks.filter(t => t._id !== task._id));
    } catch (error) {
      console.error('Failed to permanently delete task');
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-bg overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="px-8 py-6 flex justify-between items-center border-b border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Archive className="text-brand-600 dark:text-brand-400" />
              History
            </h1>
            <p className="text-slate-500 dark:text-slate-400">View your completed and deleted tasks</p>
          </div>
        </header>

        <main className="flex-1 p-8">
          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading history...</div>
          ) : historyTasks.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-300 dark:border-dark-border rounded-xl">
              <Archive className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No history yet</h3>
              <p className="text-slate-500 dark:text-slate-400">Deleted tasks will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {historyTasks.map((task, index) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.2 }}
                    key={task._id}
                    className="p-6 glass-panel rounded-xl group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      {task.boardId?.name || 'Unknown Board'}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleRestore(task)}
                        title="Restore Task"
                        className="text-slate-400 hover:text-brand-600 transition-all duration-200 hover:scale-110 active:scale-95 bg-white dark:bg-dark-border rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button 
                        onClick={() => handlePermanentDelete(task)}
                        title="Permanently Delete Task"
                        className="text-slate-400 hover:text-red-500 transition-all duration-200 hover:scale-110 active:scale-95 bg-white dark:bg-dark-border rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-through opacity-70">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 opacity-70">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center text-xs text-slate-400 mt-auto pt-4 border-t border-slate-100 dark:border-dark-border/50">
                    <Clock size={14} className="mr-1" />
                    Deleted on {new Date(task.updatedAt).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default History;
