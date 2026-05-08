import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Calendar, AlignLeft, Flag } from 'lucide-react';

const TaskModal = ({ task, columns, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'low',
    columnId: columns[0]?.id || '',
    dueDate: '',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-dark-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative z-10 border border-slate-100 dark:border-dark-border"
        >
          <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-dark-border/50">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              {task?._id ? 'Edit Task' : 'New Task'}
            </h2>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-dark-border/50"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Task title"
                  required
                  className="w-full text-xl font-medium bg-transparent border-0 border-b-2 border-transparent focus:border-brand-500 focus:ring-0 px-0 py-2 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                  autoFocus
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <AlignLeft size={16} />
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Add a more detailed description..."
                      rows={4}
                      className="input-field resize-none"
                    />
                  </div>
                </div>

                <div className="w-full sm:w-64 space-y-4 bg-slate-50 dark:bg-dark-bg p-4 rounded-xl border border-slate-100 dark:border-dark-border/50">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Status</label>
                    <select 
                      name="columnId" 
                      value={formData.columnId} 
                      onChange={handleChange}
                      className="input-field py-1.5 text-sm"
                    >
                      {columns.map(col => (
                        <option key={col.id} value={col.id}>{col.title}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      <Flag size={14} /> Priority
                    </label>
                    <select 
                      name="priority" 
                      value={formData.priority} 
                      onChange={handleChange}
                      className="input-field py-1.5 text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      <Calendar size={14} /> Due Date
                    </label>
                    <input 
                      type="date" 
                      name="dueDate" 
                      value={formData.dueDate} 
                      onChange={handleChange}
                      className="input-field py-1.5 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100 dark:border-dark-border/50">
              {task?._id ? (
                <button 
                  type="button" 
                  onClick={() => onDelete(task._id)}
                  className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  <Trash2 size={16} /> Delete
                </button>
              ) : <div></div>}
              <div className="flex gap-3">
                <button type="button" onClick={onClose} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Task
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskModal;
