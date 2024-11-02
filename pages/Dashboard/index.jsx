import styles from "./dashboard.module.css";

import {  Link, Outlet, useNavigate } from "react-router-dom";


import proManage from "../../assests/promanage.png";
import board from "../../assests/board.png";
import analytics from "../../assests/analytics.png";
import settings from "../../assests/settings.png";
import logout from "../../assests/Logout.png";

export default function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        
        localStorage.removeItem("authToken");  
        navigate("/login");
    }; 

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.leftContainer}>
                <div className={styles.topContainer}>
                <p className={styles.title}><img src = {proManage} alt="proManage" className={styles.boardimg}/>Pro Manage</p>
                <Link className={styles.item} to="board"><img src = {board} alt="Board" className={styles.boardimg}/>Board</Link>
                <Link className={styles.item} to="analytics"><img src = {analytics} alt="Analytics" className={styles.boardimg}/>Analytics</Link>
                <Link className={styles.item} to="settings"><img src = {settings} alt="Settings" className={styles.boardimg}/>Settings</Link>
                </div>
                <div className={styles.bottomContainer}>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    <img src={logout} alt="Logout" className={styles.logoutimg}/>Logout
                </button>
                </div>

            </div>
            <div className={styles.rightContainer}>
                
                <div className={styles.bottomContainer}>
                    <Outlet />
                </div>
            </div>

        </div>
    )
}