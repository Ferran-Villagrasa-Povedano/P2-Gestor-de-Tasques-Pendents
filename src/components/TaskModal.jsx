import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Col, FloatingLabel, Form, Modal, Row } from 'react-bootstrap';

function TaskModal({ show, handleClose, setCurrentTask, saveTask, task }) {
    const isNew = task.id === null;
    const [titleInvalid, setTitleInvalid] = useState(false);
    const titleRef = useRef(null);

    useEffect(() => {
        if (show && titleRef.current) {
            titleRef.current.focus();
        }
    }, [show]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        setCurrentTask(prevTask => {
            const newTask = { ...prevTask };

            if (name === 'date' && value) {
                newTask.date = new Date(value);

            } else if (name === 'time' && value) {
                const [hours, minutes] = value.split(':');
                newTask.time = new Date();
                newTask.time.setHours(hours, minutes);

            } else {
                newTask[name] = value;
            }
            return newTask;
        });
    }, [setCurrentTask]);


    const handleSave = useCallback(() => {
        if (task.title && task.title.trim()) {
            const isWhitespaceString = str => !str.replace(/\s/g, '').length;

            saveTask({
                ...task,
                title: task.title.trim(),
                description: task.description && !isWhitespaceString(task.description) ? task.description : '' // ensure description is not fully withe spaces
            });
            handleClose();
        } else {
            // if the title is not set
            setTitleInvalid(true);
            titleRef.current.focus(); // Focus on the title input
        }
    }, [task, saveTask, handleClose]);

    // Format the date input to "YYYY-MM-DD"
    const dateString = useMemo(() => {
        if (task.date instanceof Date) {
            const year = task.date.getFullYear();
            const month = String(task.date.getMonth() + 1).padStart(2, '0');
            const day = String(task.date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
        return task.date || '';
    }, [task.date]);

    // Format the time input to "HH:MM"
    const timeString = useMemo(() => {
        if (task.time instanceof Date) {
            const hours = String(task.time.getHours()).padStart(2, '0');
            const minutes = String(task.time.getMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
        }
        return task.time || '';
    }, [task.time]);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isNew ? "Add New Task" : "Edit Task"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <FloatingLabel controlId="floatingTitle" label="Title" className="mb-3">
                        <Form.Control
                            ref={titleRef}
                            type="text"
                            placeholder="Task Title"
                            name="title"
                            maxLength={50}
                            value={task.title || ''}
                            onChange={(e) => { setTitleInvalid(false); handleChange(e); }}
                            onKeyDownCapture={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault(); // prevent form submision
                                    handleSave(); // make the enter save
                                }
                            }}
                            isInvalid={titleInvalid}
                        />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingDescription" label="Description" className="mb-3">
                        <Form.Control
                            style={{ height: '150px' }}
                            as="textarea"
                            rows={3}
                            placeholder="Task Description"
                            name="description"
                            value={task.description || ''}
                            onChange={handleChange}
                        />
                    </FloatingLabel>
                    <Row className="g-2">
                        <Col md>
                            <FloatingLabel controlId="floatingDate" label="Date" className="mb-3">
                                <Form.Control
                                    type="date"
                                    placeholder="Due Date"
                                    name="date"
                                    value={dateString}
                                    onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Col>
                        <Col md>
                            <FloatingLabel controlId="floatingTime" label="Time" className="mb-3">
                                <Form.Control
                                    type="time"
                                    placeholder="Due Time"
                                    name="time"
                                    value={timeString}
                                    onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleSave}>
                    {isNew ? "Add Task" : "Save Changes"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default TaskModal;
