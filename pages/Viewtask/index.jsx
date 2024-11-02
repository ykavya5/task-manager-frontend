import { useState } from "react";
import styles from "./viewtask.module.css";
import { moveTask, deleteTaskById } from "../../services/board";

export default function Viewtask({ task, onOpenEdit }) {
    const [isChecklistVisible, setIsChecklistVisible] = useState(false);
    const [taskStatus, setTaskStatus] = useState(task.status);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [dueDate, setDueDate] = useState(task?.dueDate ? new Date(task.dueDate) : null);

    const toggleChecklistVisibility = () => {
        setIsChecklistVisible(!isChecklistVisible);
    };

    const toggleMenuVisibility = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    const handleStatusChange = async (newStatus) => {
        newStatus = newStatus.toLowerCase();
        if (newStatus === "progress") {
            newStatus = "inprogress";
        } else if (newStatus === "to-do") {
            newStatus = "todo";
        }
        const updatedTask = await moveTask(task._id, newStatus);
        setTaskStatus(updatedTask.status);
    };

    const renderStatusButtons = () => {
        const statusOptions = {
            backlog: ["Progress", "To-Do", "Done"],
            todo: ["Backlog", "Progress", "Done"],
            inprogress: ["Backlog", "To-Do", "Done"],
            done: ["Backlog", "To-Do", "Progress"]
        };
        const buttons = statusOptions[taskStatus.toLowerCase()];

        return buttons.map((status) => (
            <button
                key={status}
                className={styles.statusButton}
                onClick={() => handleStatusChange(status)}
            >
                {status.toUpperCase()}
            </button>
        ));
    };

    const openEditTask = () => {
        onOpenEdit(task);
    };
    const deleteTask = async () => {
        setIsDeleteModalVisible(true);
    }
    const handleDeleteTask = async () => {
        deleteTaskById(task._id);
        setIsDeleteModalVisible(false);
    }

    const formatDueDate = (date) => {
        if (!(date instanceof Date)) return "";
        if (isNaN(date)) return "";

        const options = { month: 'short', day: 'numeric' };
        const friendlyDate = date.toLocaleDateString(undefined, options);

        // Get the ordinal suffix
        const day = date.getDate();
        const suffix = day % 10 === 1 && day !== 11 ? 'st' :
            day % 10 === 2 && day !== 12 ? 'nd' :
                day % 10 === 3 && day !== 13 ? 'rd' : 'th';

        return ` ${friendlyDate}${suffix}`;
    };
    let priorityClass;
    switch (task.priority) {
        case 'high':
            priorityClass = styles.highPriority;
            break;
        case 'moderate':
            priorityClass = styles.moderatePriority;
            break;
        case 'low':
            priorityClass = styles.lowPriority;
            break;
    }


    return (
        <div className={styles.taskContainer}>
            <div className={styles.menu}>
                <div className={styles.priorityContainer}>
                    <div className={priorityClass}></div>
                    <p className={styles.priorityText}>{task.priority.toUpperCase() || "No priority"} PRIORITY</p>
                </div>
                <button className={styles.menuButton} onClick={toggleMenuVisibility}>
                    ...
                    {isMenuVisible && (
                        <div className={styles.dropdownMenu}>
                            <p onClick={openEditTask}>Edit</p>
                            <p onClick={() => console.log("Share clicked")}>Share</p>
                            <p onClick={deleteTask} className={styles.deleteOption}>Delete</p>
                        </div>
                    )}
                </button>
            </div>
            <h3>{task.title || "No title available"}</h3>

            
            <div className={styles.checklistContainer}>
                <div className={styles.checklistflex}>
                    <div>
                        <h4 className={styles.checklistTitle} onClick={toggleChecklistVisibility}>
                            Checklist ({task.checklist.filter(item => item.checked).length}/{task.checklist.length})
                        </h4>
                    </div>
                    <div>
                        <button className={styles.toggleButton} onClick={toggleChecklistVisibility}>
                            {isChecklistVisible ? "^" : "v"}
                        </button>
                    </div>
                </div>

                {isChecklistVisible && (
                    <div className={styles.checklistItems}>
                        {task.checklist.map((item1, index) => (
                            <div key={index} className={styles.checklistItem}>
                                <input
                                    type="checkbox"
                                    checked={item1.checked}
                                    readOnly
                                />
                                <input
                                    type="text"
                                    value={item1.item}
                                    readOnly
                                    className={styles.textInput}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

           
            <div className={styles.footer}>
                <span className={styles.date}>{formatDueDate(dueDate)}</span>
                <div className={styles.statusButtons}>
                    {renderStatusButtons()}
                </div>
            </div>

            {isDeleteModalVisible && (
                <div className={styles.deleteModal}>
                    <h2>Are you sure you want to delete this task?</h2>
                    <button className={styles.deleteButton} onClick={handleDeleteTask}>Delete</button>
                    <button className={styles.cancelButton} onClick={() => setIsDeleteModalVisible(false)}>Cancel</button>
                </div>
            )}
        </div>


    );
}
