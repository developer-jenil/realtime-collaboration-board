import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { Sparkles, Clock, AlertCircle } from 'lucide-react';
import TaskCard from '../components/Board/TaskCard';

const priorityColors = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

const Suggestions = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const { data } = await api.get('/tasks/suggestions');
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (error) {
      console.error('Failed to complete task', error);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-bg overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="px-8 py-6 flex justify-between items-center border-b border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="text-amber-500" />
              AI Suggestions
            </h1>
            <p className="text-slate-500 dark:text-slate-400">Your most urgent tasks across all projects, intelligently sorted</p>
          </div>
        </header>

        <main className="flex-1 p-8">
          {loading ? (
            <div className="text-center py-12 text-slate-500">Analyzing tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-300 dark:border-dark-border rounded-xl">
              <Sparkles className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">You're all caught up!</h3>
              <p className="text-slate-500 dark:text-slate-400">No active tasks found across your boards.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {tasks.map((task, index) => {
                  const formattedDate = task.dueDate 
                    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : null;

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ duration: 0.2 }}
                      key={task._id}
                      className="p-6 glass-panel rounded-xl group relative overflow-hidden border border-brand-500/10 hover:border-brand-500/30 transition-colors"
                    >
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-brand-400 to-brand-600 rounded-l-xl opacity-50" />
                    
                    <div className="flex justify-between items-start mb-3 pl-3">
                      <span className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        {task.boardId?.name || 'Unknown Board'}
                      </span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-md ${priorityColors[task.priority] || priorityColors.low}`}>
                        {task.priority || 'low'}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 pl-3">{task.title}</h3>
                    
                    {task.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 pl-3">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-auto pt-4 border-t border-slate-100 dark:border-dark-border/50 pl-3">
                      <div className="flex items-center gap-1 font-medium">
                        {formattedDate ? (
                          <>
                            <Clock size={14} className="text-amber-500" />
                            <span className="text-amber-600 dark:text-amber-500">Due: {formattedDate}</span>
                          </>
                        ) : (
                          <span>No due date</span>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => handleCompleteTask(task._id)}
                        className="text-brand-600 dark:text-brand-400 hover:text-brand-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Complete Task
                      </button>
                    </div>
                  </motion.div>
                );
              })}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Suggestions;
