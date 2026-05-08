import React, { useMemo } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

const Column = ({ column, tasks, onAddTask, onTaskClick, onComplete }) => {
  const taskIds = useMemo(() => tasks.map(t => t._id), [tasks]);

  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  return (
    <div className="flex flex-col bg-slate-100/50 dark:bg-dark-card/30 rounded-xl w-80 shrink-0 h-full max-h-full border border-slate-200/60 dark:border-dark-border/40">
      <div className="p-4 flex justify-between items-center border-b border-slate-200/60 dark:border-dark-border/40">
        <h3 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          {column.title}
          <span className="bg-slate-200 dark:bg-dark-border text-slate-600 dark:text-slate-400 text-xs py-0.5 px-2 rounded-full">
            {tasks.length}
          </span>
        </h3>
        <button 
          onClick={onAddTask}
          className="p-1 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      <div 
        ref={setNodeRef}
        className="flex-1 p-3 overflow-y-auto overflow-x-hidden flex flex-col gap-3"
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onClick={() => onTaskClick(task)}
              onComplete={onComplete}
            />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="h-full border-2 border-dashed border-transparent rounded-lg flex items-center justify-center text-slate-400 text-sm py-8">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;
