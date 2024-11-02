import React, { useEffect, useState } from 'react';
import { fetchAnalyticsData } from '../../services/board';
import styles from './analytics.module.css';

export default function Analytics() {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);  
            try {
                const data = await fetchAnalyticsData();
                setAnalyticsData(data);
                setLoading(false); 
            } catch (err) {
                console.error("Error fetching analytics data:", err);
                setError("Failed to load analytics data.");
                setLoading(false); 
            }
        };

        loadData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={styles.container}>
            <h1>Analytics</h1>
            {analyticsData && (
                <div className={styles.analyticsSection}>
                    <div className={styles.analyticsColumn}>
                        <ul>
                            <li>
                                <span className={styles.circle}></span>
                                <span className={styles.taskName}>Backlog Tasks</span>
                                <span className={styles.taskCount}>{analyticsData.statusCounts?.backlog || 0}</span>
                            </li>
                            <li>
                                <span className={styles.circle}></span>
                                <span className={styles.taskName}>To-do Tasks</span>
                                <span className={styles.taskCount}>{analyticsData.statusCounts?.todo || 0}</span>
                            </li>
                            <li>
                                <span className={styles.circle}></span>
                                <span className={styles.taskName}>In-Progress Tasks</span>
                                <span className={styles.taskCount}>{analyticsData.statusCounts?.inprogress || 0}</span>
                            </li>
                            <li>
                                <span className={styles.circle}></span>
                                <span className={styles.taskName}>Completed Tasks</span>
                                <span className={styles.taskCount}>{analyticsData.statusCounts?.done || 0}</span>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.analyticsColumn}>
                        <ul>
                            <li>
                                <span className={styles.circle}></span>
                                <span className={styles.taskName}>Low Priority</span>
                                <span className={styles.taskCount}>{analyticsData.priorityCounts?.low || 0}</span>
                            </li>
                            <li>
                                <span className={styles.circle}></span>
                                <span className={styles.taskName}>Moderate Priority</span>
                                <span className={styles.taskCount}>{analyticsData.priorityCounts?.moderate || 0}</span>
                            </li>
                            <li>
                                <span className={styles.circle}></span>
                                <span className={styles.taskName}>High Priority</span>
                                <span className={styles.taskCount}>{analyticsData.priorityCounts?.high || 0}</span>
                            </li>
                            <li>
                                <span className={styles.circle}></span>
                                <span className={styles.taskName}>Due Date Tasks</span>
                                <span className={styles.taskCount}>{analyticsData.dueDateTasks || 0}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
