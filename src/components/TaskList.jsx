import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Col, ListGroup, Row } from 'react-bootstrap';
import FilterDropdown from './FilterDropdown';
import SortDropdown from './SortDropdown';
import Task from './Task';
import TaskModal from './TaskModal';

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [filterOption, setFilterOption] = useState('all'); // Changed to filterOption
    const [sortOption, setSortOption] = useState('creationDate'); // Sorting option
    const [showModal, setShowModal] = useState(false);
    const [currentTask, setCurrentTask] = useState(null); // State to manage current task for editing

    // Load tasks from localStorage on component mount
    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            const parsedTasks = JSON.parse(storedTasks).map(task => ({
                ...task,
                date: task.date && new Date(task.date),
                time: task.time && new Date(task.time)
            }));
            setTasks(parsedTasks);
        }
    }, []);

    // Save tasks to localStorage whenever the tasks state changes
    useEffect(() => {
        if (tasks.length > 0) {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        } else {
            localStorage.removeItem('tasks'); // clear local storage if tasks are empty
        }
    }, [tasks]);


    const handleShowModal = useCallback(() => setShowModal(true), []);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setCurrentTask(null)
    }, []);

    const resetCurrentTask = useCallback(() => {
        setCurrentTask({ id: null, title: null, description: null, date: null, time: null, completed: false });
    }, []);

    const saveTask = useCallback((taskToSave) => {
        setTasks(prevTasks => {
            const nextId = prevTasks.length > 0 ? Math.max(...prevTasks.map(task => task.id)) + 1 : 1;
            const taskWithId = taskToSave.id === null ? { ...taskToSave, id: nextId } : taskToSave;

            const existingTaskIndex = prevTasks.findIndex(task => task.id === taskWithId.id);
            let updatedTasks;

            if (existingTaskIndex !== -1) {
                // If task exists, update the existing task
                updatedTasks = prevTasks.map((task, index) =>
                    index === existingTaskIndex ? { ...task, ...taskWithId } : task
                );
            } else {
                // If task doesn't exist, add the new task
                updatedTasks = [...prevTasks, taskWithId];
            }

            return updatedTasks; // Return updated tasks to update state
        });

        setCurrentTask(null)
        handleCloseModal();
    }, [resetCurrentTask, handleCloseModal]);

    const deleteTask = useCallback((id) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    }, []);

    const toggleTaskCompletion = useCallback((id) => {
        setTasks(prevTasks => prevTasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    }, []);

    const handleAddTask = useCallback(() => {
        setCurrentTask({ id: null, title: null, description: null, date: null, time: null, completed: false });
        handleShowModal();
    }, [resetCurrentTask, handleShowModal]);

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            if (filterOption === 'completed') return task.completed;
            if (filterOption === 'pending') return !task.completed;
            return true;
        });
    }, [tasks, filterOption]); // Only recompute when tasks or filterOption changes

    const sortedTasks = useMemo(() => {
        return [...filteredTasks].sort((a, b) => {
            if (sortOption === 'creationDate') {
                return a.id - b.id; // Sort by creation date (ascending)
            } else if (sortOption === 'dueDate') {
                if (a.date == b.date) {
                    if (!a.time) return 1;
                    if (!b.time) return -1;
                    return a.time - b.time;
                }
                if (!a.date) return 1;
                if (!b.date) return -1;
                return a.date - b.date; // Sort by date (ascending)
            } else if (sortOption === 'completionStatus') {
                return (a.completed === b.completed) ? 0 : a.completed ? 1 : -1; // Completed tasks last
            }
            return 0; // No sorting
        });
    }, [filteredTasks, sortOption]);

    return (
        <div>
            <Row className="mb-3">
                <Col xs="auto">
                    <Button variant="primary" className="rounded-pill" onClick={handleAddTask}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor" className="me-2">
                            <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q32 0 62-6t58-17l60 61q-41 20-86 31t-94 11Zm280-80v-120H640v-80h120v-120h80v120h120v80H840v120h-80ZM424-296 254-466l56-56 114 114 400-401 56 56-456 457Z" />
                        </svg>
                        Add Task
                    </Button>
                </Col>
                <Col></Col>
                <Col xs="auto">
                    <FilterDropdown
                        filterOption={filterOption} // Use filterOption
                        setFilterOption={setFilterOption}
                        options={[
                            { value: 'all', label: 'All Tasks' },
                            { value: 'completed', label: 'Completed' },
                            { value: 'pending', label: 'Pending' },
                        ]}
                    />
                </Col>
                <Col xs="auto">
                    <SortDropdown
                        sortOption={sortOption}
                        setSortOption={setSortOption}
                        options={[
                            { value: 'creationDate', label: 'Sort by Creation Date' },
                            { value: 'dueDate', label: 'Sort by Due Date' },
                            { value: 'completionStatus', label: 'Sort by Completion Status' },
                        ]}
                    />
                </Col>

            </Row>

            <ListGroup>
                {sortedTasks.length === 0 ? (
                    <ListGroup.Item className="text-center">
                        <h3>No tasks yet.</h3>
                        Please add a task to get started!
                    </ListGroup.Item>
                ) : (
                    sortedTasks.map(task => (
                        <Task
                            key={task.id}
                            task={task}
                            deleteTask={deleteTask}
                            toggleTaskCompletion={toggleTaskCompletion}
                            onEdit={() => { setCurrentTask(task); handleShowModal(); }} // Handle editing
                        />
                    ))
                )}
            </ListGroup>

            {currentTask ?
                <TaskModal
                    show={showModal}
                    handleClose={handleCloseModal}
                    setCurrentTask={setCurrentTask}
                    saveTask={saveTask}
                    task={currentTask}
                />
                : null
            }
        </div>
    );
}

export default TaskList;
