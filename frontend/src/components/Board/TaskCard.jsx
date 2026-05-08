import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const priorityColors = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

const TaskCard = ({ task, isOverlay, onClick, onComplete }) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const formattedDate = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="opacity-50 glass-panel rounded-xl p-4 border-2 border-brand-500 min-h-[100px]" 
      />
    );
  }

  return (
    <motion.div
      layoutId={task._id}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`glass-panel p-4 rounded-xl cursor-grab active:cursor-grabbing hover:shadow-md hover:-translate-y-0.5 transition-all group ${isOverlay ? 'rotate-2 scale-105 shadow-xl' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-xs font-medium px-2 py-1 rounded-md ${priorityColors[task.priority] || priorityColors.low}`}>
          {task.priority || 'low'}
        </span>
        {!isOverlay && onComplete && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onComplete(task._id);
            }}
            className="text-slate-300 hover:text-green-500 dark:text-slate-600 dark:hover:text-green-400 transition-all duration-200 hover:scale-110 active:scale-95 bg-white dark:bg-dark-border hover:bg-green-50 dark:hover:bg-green-500/10 rounded-full p-1 opacity-0 group-hover:opacity-100 shadow-sm"
            title="Mark as completed"
          >
            <CheckCircle size={16} />
          </button>
        )}
      </div>
      <h4 className="text-slate-900 dark:text-slate-100 font-medium mb-1 line-clamp-2">
        {task.title}
      </h4>
      {task.description && (
        <p className="text-slate-500 dark:text-slate-400 text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between mt-3 text-slate-400 dark:text-slate-500">
        <div className="flex items-center gap-3">
          {formattedDate && (
            <div className="flex items-center gap-1 text-xs">
              <Clock size={12} />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>
        {/* Placeholder for assignee avatar */}
        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-dark-border border border-white dark:border-dark-bg flex items-center justify-center text-xs text-slate-500">
           U
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
