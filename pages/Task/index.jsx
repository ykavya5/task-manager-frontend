import { useState, useEffect } from "react";
import DatePicker from "react-datepicker"; // Import the DatePicker component
import "react-datepicker/dist/react-datepicker.css"; // Import the styles
import { fetchBoardByUser, createTask, updateTask, fetchAvailableUsers } from "../../services/board";
import styles from "./task.module.css";
import deleteIcon from "../../assests/deleteIcon.png";

export default function Task({ onClose, currentTask }) {
    const [boardId, setBoardId] = useState("");
    const [title, setTitle] = useState(currentTask?.title || "");
    const [priority, setPriority] = useState(currentTask?.priority || "");
    const [assignee, setAssignee] = useState(currentTask?.assignedTo || "");
    const [dueDate, setDueDate] = useState(currentTask?.dueDate ? new Date(currentTask.dueDate) : null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [checklist, setChecklist] = useState(currentTask?.checklist || []);
    const [error, setError] = useState({});
    const [availableUsers, setAvailableUsers] = useState([]);

    const today = new Date();

    const handleSelectDate = (date) => {
        setDueDate(date);
        setShowCalendar(false); 
    };

    const handleCancel = () => {
        onClose();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const board = await fetchBoardByUser();
                setBoardId(board._id);
                const users = await fetchAvailableUsers();
                const filteredUsers = users.filter(user => user._id !== board.owner);
                setAvailableUsers(filteredUsers);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const errorMessages = {
        title: "Please enter a title",
        priority: "Please select a priority",
        checklist: "Please select at least one item",
    };

    const validateForm = () => {
        let formErrors = {};
        if (!title) formErrors.title = errorMessages.title;
        if (!priority) formErrors.priority = errorMessages.priority;
        if (checklist.every((item) => !item.item)) formErrors.checklist = errorMessages.checklist;

        setError(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const taskData = {
                title,
                priority,
                dueDate: dueDate ? dueDate.toISOString() : null, 
                assignedTo: JSON.stringify([assignee]),
                checklist: JSON.stringify([...checklist]),
            };

            try {
                if (currentTask?._id) {
                    await updateTask(currentTask._id, taskData);
                } else {
                    await createTask(boardId, taskData);
                }

                if (!currentTask?._id) {
                    setTitle("");
                    setPriority("");
                    setAssignee("");
                    setDueDate(null);
                    setChecklist([{ item: "", checked: false }]);
                    setError({});
                }
                onClose();
            } catch (error) {
                console.error("Task save failed:", error);
            }
        }
    };

    const addCheckList = () => setChecklist([...checklist, { item: "", checked: false }]);

    const removeCheckList = (index) => {
        const newChecklist = checklist.filter((_, i) => i !== index);
        setChecklist(newChecklist);
    };

    const handleCheckboxChange = (index) => {
        setChecklist((prevChecklist) => {
            return prevChecklist.map((item, i) =>
                i === index ? { ...item, checked: !item.checked } : item
            );
        });
    };

    const handleTextChange = (index, item) => {
        const newChecklist = [...checklist];
        newChecklist[index].item = item;
        setChecklist(newChecklist);
    };

    return (
        <div className={styles.container}>
            <h2>{currentTask ? "Edit Task" : ""}</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.topWrapper}>
                    <label htmlFor="title">Title *</label>
                    <input
                        name="title"
                        type="text"
                        placeholder="Enter Task Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.title}
                    />
                    {error.title && <p className={styles.error}>{error.title}</p>}

                    <div className={styles.priorityWrapper}>
                        <label htmlFor="priority" className={styles.priorityLabel}>Select Priority *</label>
                        <div className={styles.priorityContainer}>
                            <button
                                type="button"
                                onClick={() => setPriority('high')}
                                className={`${styles.priorityOption} ${priority === 'high' ? styles.selected : ''} ${styles.high}`}
                            >
                                <span className={styles.priorityDot}></span> HIGH PRIORITY
                            </button>
                            <button
                                type="button"
                                onClick={() => setPriority('moderate')}
                                className={`${styles.priorityOption} ${priority === 'moderate' ? styles.selected : ''} ${styles.moderate}`}
                            >
                                <span className={styles.priorityDot}></span> MODERATE PRIORITY
                            </button>
                            <button
                                type="button"
                                onClick={() => setPriority('low')}
                                className={`${styles.priorityOption} ${priority === 'low' ? styles.selected : ''} ${styles.low}`}
                            >
                                <span className={styles.priorityDot}></span> LOW PRIORITY
                            </button>
                        </div>
                    </div>

                    {error.priority && <p className={styles.error}>{error.priority}</p>}
                    <div className={styles.assigneeWrapper}>
                        <label htmlFor="assignee">Assign to</label>
                        <select
                            value={assignee}
                            onChange={(e) => setAssignee(e.target.value)}
                            className={styles.assignee}
                        >
                            <option value=""> Add an assignee</option>
                            {availableUsers?.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.checklistContainer}>
                        <h2>Checklist ({checklist.filter(item => item.checked).length}/{checklist.length}) *</h2>
                        {checklist.map((item, index) => (
                            <div key={index} className={styles.checklistItem}>
                                <input
                                    className={styles.checklistCheckbox}
                                    type="checkbox"
                                    checked={item.checked}
                                    onChange={() => handleCheckboxChange(index)}
                                />
                                <input
                                    className={styles.textInput}
                                    type="text"
                                    value={item.item}
                                    placeholder="Add a Task"
                                    onChange={(e) => handleTextChange(index, e.target.value)}
                                />
                                <img src={deleteIcon} onClick={() => removeCheckList(index)} className={styles.remove} />
                            </div>
                        ))}
                        <button type="button" onClick={addCheckList} className={styles.add}>
                            + Add New
                        </button>
                        {error.checklist && <p className={styles.error}>{error.checklist}</p>}
                    </div>
                </div>
                <div className={styles.bottomWrapper}>
                    <div className={styles.dueDate}>
                        <button type="button" className={styles.datePicker} onClick={() => setShowCalendar((prev) => !prev)}>
                            {dueDate ? dueDate.toLocaleDateString() : "Select Due Date"}
                        </button>
                        {showCalendar && (
                            <div style={{ position: 'absolute', zIndex: '10', marginTop: '-280px' }}>
                                <DatePicker
                                    selected={dueDate}
                                    onChange={handleSelectDate}
                                    inline 
                                    minDate={today} 
                                />
                            </div>
                        )}
                    </div>

                    <div className={styles.actions}>
                        <button type="button" onClick={handleCancel} className={styles.cancel}>Cancel</button>
                        <button type="submit" className={styles.save} disabled={!boardId}>
                            {currentTask?._id ? "Update" : "Save"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
