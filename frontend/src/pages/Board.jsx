import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import Column from '../components/Board/Column';
import TaskModal from '../components/Board/TaskModal';
import { 
  DndContext, 
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import TaskCard from '../components/Board/TaskCard';

const Board = () => {
  const { id } = useParams();
  const socket = useSocket();
  const { user } = useAuth();
  
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchBoard();
    fetchTasks();

    if (socket) {
      socket.emit('board:join', id);

      socket.on('task:created', (newTask) => {
        setTasks((prev) => [...prev, newTask]);
      });

      socket.on('task:updated', (updatedTask) => {
        setTasks((prev) => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
      });

      socket.on('task:moved', (movedTask) => {
         setTasks((prev) => {
           const newTasks = [...prev];
           const idx = newTasks.findIndex(t => t._id === movedTask._id);
           if(idx !== -1) {
             newTasks[idx] = movedTask;
           }
           return newTasks;
         });
      });

      socket.on('task:deleted', (taskId) => {
        setTasks((prev) => prev.filter(t => t._id !== taskId));
      });

      return () => {
        socket.emit('board:leave', id);
        socket.off('task:created');
        socket.off('task:updated');
        socket.off('task:moved');
        socket.off('task:deleted');
      };
    }
  }, [id, socket]);

  const fetchBoard = async () => {
    try {
      const { data } = await api.get(`/boards/${id}`);
      setBoard(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data } = await api.get(`/tasks/board/${id}`);
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t._id === active.id);
    setActiveTask(task);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    // Dropping a Task over another Task
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t._id === activeId);
        const overIndex = tasks.findIndex((t) => t._id === overId);

        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          const newTasks = [...tasks];
          newTasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(newTasks, activeIndex, overIndex);
        }
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // Dropping a Task over a Column
    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t._id === activeId);
        const newTasks = [...tasks];
        newTasks[activeIndex].columnId = overId;
        return arrayMove(newTasks, activeIndex, activeIndex);
      });
    }
  };

  const handleDragEnd = async (event) => {
    setActiveTask(null);
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const task = tasks.find(t => t._id === activeId);
    if (!task) return;

    let targetColumnId = task.columnId;
    
    const isOverColumn = over.data.current?.type === 'Column';
    if(isOverColumn) {
       targetColumnId = over.id;
    } else {
       const overTask = tasks.find(t => t._id === overId);
       if(overTask) targetColumnId = overTask.columnId;
    }
    
    // Find new index/order
    const columnTasks = tasks.filter(t => t.columnId === targetColumnId);
    let newOrder = columnTasks.length; // simplify for now

    try {
      await api.put(`/tasks/${activeId}/move`, {
        columnId: targetColumnId,
        order: newOrder
      });
    } catch (error) {
      console.error('Failed to move task', error);
      fetchTasks(); // Revert on failure
    }
  };

  const openTaskModal = (task = null, columnId = null) => {
    setSelectedTask(task ? { ...task } : { boardId: id, columnId });
    setIsModalOpen(true);
  };

  const handleTaskSave = async (taskData) => {
    try {
      if (taskData._id) {
        await api.put(`/tasks/${taskData._id}`, taskData);
      } else {
        await api.post('/tasks', taskData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
    } catch (error) {
      console.error('Failed to complete task', error);
    }
  };

  if (!board) return <div className="p-8 text-center text-slate-500">Loading board...</div>;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-bg overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="px-8 py-6 flex justify-between items-center border-b border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg z-10 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{board.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex -space-x-2">
                {board.members.map(m => (
                  <div key={m._id} className="w-8 h-8 rounded-full bg-brand-500 border-2 border-white dark:border-dark-bg flex items-center justify-center text-white text-xs font-bold" title={m.name}>
                    {m.name.charAt(0)}
                  </div>
                ))}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">{board.members.length} members</span>
            </div>
          </div>
          <button 
            onClick={() => openTaskModal(null, board.columns[0]?.id)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add Task
          </button>
        </header>

        <div className="flex-1 overflow-x-auto p-8 h-full">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-6 h-full min-w-max pb-4">
              {board.columns.map((col) => (
                <Column 
                  key={col.id} 
                  column={col} 
                  tasks={tasks.filter(t => t.columnId === col.id)}
                  onAddTask={() => openTaskModal(null, col.id)}
                  onTaskClick={(task) => openTaskModal(task)}
                  onComplete={handleCompleteTask}
                />
              ))}
            </div>

            <DragOverlay>
              {activeTask ? (
                <TaskCard task={activeTask} isOverlay />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {isModalOpen && (
        <TaskModal 
          task={selectedTask}
          columns={board.columns}
          onClose={() => setIsModalOpen(false)}
          onSave={handleTaskSave}
          onDelete={async (id) => {
             await api.delete(`/tasks/${id}`);
             setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Board;
