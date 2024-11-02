import styles from "./board.module.css";
import { useEffect, useState } from "react";
import collapseAll from "../../assests/collapseAll.png";
import addPeople from "../../assests/addPeople.png";
import addIcon from "../../assests/addIcon.png";
import { getUser, fetchBoardByUser, deleteAllTasksByStatus } from "../../services/board";
import Task from "../Task/index";
import Viewtask from "../Viewtask/index";
import AddPeople from "../AddPeople/index";

export default function Board() {
    const [user, setUser] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [isLoadingTasks, setIsLoadingTasks] = useState(true);
    const [error, setError] = useState(false);
    const [tasks, setTasks] = useState({ backlog: [], todo: [], inprogress: [], done: [] });
    const [today, setToday] = useState(new Date());
    const [isTaskOpen, setIsTaskOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [isAddPeopleModalVisible, setIsAddPeopleModalVisible] = useState(false);

    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await getUser();
                setUser(res.data);
            } catch {
                setError(true);
            } finally {
                setIsLoadingUser(false);
            }
        };

        const fetchTasksData = async () => {
            try {
                const board = await fetchBoardByUser();
                if (board && board.tasks) {
                    setTasks(board.tasks);
                }
            } catch {
                setError(true);
            } finally {
                setIsLoadingTasks(false);
            }
        };

        fetchUserData();
        fetchTasksData();
    }, []);

   
    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.toLocaleString("en-US", { month: "short" });
        const year = date.getFullYear();
        const suffix = day % 10 === 1 && day !== 11 ? "st" :
                       day % 10 === 2 && day !== 12 ? "nd" :
                       day % 10 === 3 && day !== 13 ? "rd" : "th";
        return `${day}${suffix} ${month}, ${year}`;
    };

    const todayFormatted = formatDate(today);

    const handleOpenEdit = (task) => {
        setCurrentTask(task);
        setIsTaskOpen(true);
    };

    const renderTasks = (taskList) => {
        return taskList.map(task => (
            <Viewtask key={task._id} task={task} onOpenEdit={handleOpenEdit} />
        ));
    };

   
    const handleAddTaskClick = () => {
        setCurrentTask(null);
        setIsTaskOpen(true);
    };

    const closeTaskForm = () => {
        setIsTaskOpen(false);
        setCurrentTask(null);
    };

    const handleDeleteAll = (status) => {
        deleteAllTasksByStatus(status).then(() => { 
            setTasks(tasks.filter(task => task.status !== status));
        }); 
    }

    const handleAddPeople = () =>{
        setIsAddPeopleModalVisible(true);
    }

    return (
        <div className={styles.container}>
            <div className={styles.topContainer}>
                <p className={styles.wel}>
                    Welcome! <span>
                        {isLoadingUser ? <span>Loading user...</span> : error ? <span>Something went wrong</span> : <span>{user?.name}</span>}
                    </span>
                </p>
                <p className={styles.date}>{todayFormatted}</p>
            </div>

            <h2>Board</h2> 
            <span className={styles.addPeople} onClick={()=> handleAddPeople()}> <img src={addPeople} alt="Add People" /> Add People</span>
            <div className={styles.main}>
                <div className={styles.first}>
                    <div className={styles.innerContainer}>
                        <h5 className={styles.backlog}>Backlog</h5>
                        <img src={collapseAll} alt="Collapse All" className={styles.collapseall} onClick={() => handleDeleteAll('backlog')} />
                    </div>
                    {renderTasks(tasks.backlog)}
                </div>
                <div className={styles.second}>
                    <div className={styles.innerContainer}>
                        <h5 className={styles.todo}>To do</h5>
                        <div>
                            <img src={addIcon} alt="Add Task" className={styles.add} onClick={handleAddTaskClick} />
                            <img src={collapseAll} alt="Collapse All" className={styles.collapseall} onClick={() => handleDeleteAll('todo')}/>
                        </div>
                    </div>
                    {renderTasks(tasks.todo)}
                </div>
                <div className={styles.third}>
                    <div className={styles.innerContainer}>
                        <h5 className={styles.inprogress}>In progress</h5>
                        <img src={collapseAll} alt="Collapse All" className={styles.collapseall} onClick={() => handleDeleteAll('inprogress')} />
                    </div>
                    {renderTasks(tasks.inprogress)}
                </div>
                <div className={styles.fourth}>
                    <div className={styles.innerContainer}>
                        <h5 className={styles.done}>Done</h5>
                        <img src={collapseAll} alt="Collapse All" className={styles.collapseall} onClick={() => handleDeleteAll('done')} />
                    </div>
                    {renderTasks(tasks.done)}
                </div>
            </div>
            {isTaskOpen && (
                <div className={styles.overlay}>
                    <Task onClose={closeTaskForm} currentTask={currentTask} />
                </div>
            )}
            {isAddPeopleModalVisible &&(
                <div className={styles.overlay}>
                    <AddPeople onClose={() => setIsAddPeopleModalVisible(false)} ownerId = {user?._id} />
                </div>
            )}
            
        </div>
    );
}
