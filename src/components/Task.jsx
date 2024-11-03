import React, { useCallback, useMemo, useState } from 'react';
import { Button, Collapse, ListGroup } from 'react-bootstrap';

function Task({ task, deleteTask, toggleTaskCompletion, onEdit }) {
    const [open, setOpen] = useState(false);

    const canOpen = useMemo(() => Boolean(task.description), [task.description]);

    const handleOpen = useCallback(() => {
        setOpen(prevOpen => !prevOpen);
    }, []);

    const handleToggleCompletion = useCallback(() => {
        toggleTaskCompletion(task.id);
    }, [task.id, toggleTaskCompletion]);

    const handleDeleteTask = useCallback(() => {
        deleteTask(task.id);
    }, [task.id, deleteTask]);

    return (
        <ListGroup.Item className="d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <Button variant="primary" className='ico-btn me-2' size="sm" onClick={handleToggleCompletion}>
                        {task.completed ?
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                                <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                            </svg>
                        }
                    </Button>
                    <h6 className={`${task.completed ? 'text-muted' : ''}`} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                        {task.title}
                    </h6>
                </div>

                <div>
                    {task.date &&
                        <span className={`${task.completed ? 'text-muted' : ''}`} style={{ textDecoration: task.completed ? 'line-through' : 'none', marginRight: '10px' }}>
                            {task.date instanceof Date
                                ? task.date.toLocaleDateString(navigator.language, { year: 'numeric', month: 'numeric', day: 'numeric' })
                                : task.date}
                        </span>
                    }

                    {task.time &&
                        <span className={`${task.completed ? 'text-muted' : ''}`} style={{ textDecoration: task.completed ? 'line-through' : 'none', marginRight: '10px' }}>
                            {task.time instanceof Date
                                ? task.time.toLocaleTimeString(navigator.language, { hour: 'numeric', minute: 'numeric' })
                                : task.time}
                        </span>
                    }
                    <Button variant="secondary" className='ico-btn me-2' size="sm" onClick={handleOpen}>
                        {canOpen && (open ?
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                                <path d="m280-400 200-200 200 200H280Z" />
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                                <path d="M480-360 280-560h400L480-360Z" />
                            </svg>
                        )}
                    </Button>
                    <Button variant="secondary" className='ico-btn me-2' size="sm" onClick={onEdit}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                            <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                        </svg>
                    </Button>

                    <Button variant="danger" className='ico-btn' size="sm" onClick={handleDeleteTask}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                        </svg>
                    </Button>
                </div>
            </div>

            <Collapse in={open}>
                <div className="mt-2" style={{ overflow: 'auto', whiteSpace: 'pre-wrap', overflowWrap: 'break-word', wordWrap: 'break-word' }}>
                    {task.description}
                </div>
            </Collapse>
        </ListGroup.Item>
    );
}

export default Task;
