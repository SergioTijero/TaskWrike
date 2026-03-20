import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface Task {
    id: string;
    title: string;
    description: string;
    priority: "High" | "Medium" | "Low";
    date?: string;
    avatarUrl?: string;
    progress?: number;
    completed?: boolean;
}

interface TaskCardProps {
    task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
        data: { task }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    const priorityColors = {
        High: "text-error bg-error-container/20",
        Medium: "text-on-secondary-container bg-secondary-container/50",
        Low: "text-primary bg-primary-container/20"
    };

    return (
        <div 
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-surface-container-lowest p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow group border ${isDragging ? 'opacity-50 border-primary' : 'border-transparent hover:border-primary/10'}`}
        >
            <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${priorityColors[task.priority]}`}>
                    {task.priority || "Normal"}
                </span>
                <span className="material-symbols-outlined text-outline-variant group-hover:text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">drag_indicator</span>
            </div>
            
            <h4 className={`font-body font-bold text-on-surface text-sm mb-2 leading-tight ${task.completed ? 'line-through decoration-on-surface-variant/30' : ''}`}>
                {task.title}
            </h4>
            
            {task.description && (
                <p className="text-xs text-on-surface-variant line-clamp-2 mb-4">{task.description}</p>
            )}
            
            {task.progress !== undefined && (
                <div className="w-full bg-surface-container rounded-full h-1.5 mb-4 overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${task.progress}%` }}></div>
                </div>
            )}
            
            <div className="flex items-center justify-between mt-auto pt-2">
                {task.avatarUrl ? (
                    <div className="w-6 h-6 rounded-full border-2 border-surface-container-lowest bg-slate-300">
                        <img className="w-full h-full rounded-full object-cover" alt="Avatar" src={task.avatarUrl} />
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        {task.completed ? (
                            <span className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> 
                                Done
                            </span>
                        ) : null}
                    </div>
                )}
                
                {task.date && (
                    <div className="flex items-center gap-1 text-[10px] font-medium text-on-surface-variant">
                        <span className="material-symbols-outlined text-xs">calendar_today</span>
                        {task.date}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
