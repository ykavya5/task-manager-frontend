import styles from "./settings.module.css";
import { useState, useEffect } from "react";
import { settings, getUser } from "../../services/board";

export default function Settings() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        oldPassword: "",
        newPassword: "",
    });

    const [error, setError] = useState({
        name: false,
        email: false,
        oldPassword: false,
        newPassword: false,
    });

    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUser();
                if (res?.data) {
                    setUserId(res.data._id);  
                    setFormData({
                        name: res.data.name,
                        email: res.data.email,
                        oldPassword: "",
                        newPassword: "",
                    });
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, []);

    const errorMessages = {
        name: {
            message: "Name is required",
            isValid: formData.name.length > 0,
        },
        email: {
            message: "Email is required",
            isValid: formData.email.length > 0,
        },
        oldPassword: {
            message: "Old password is required",
            isValid: formData.oldPassword.length > 0,
        },
        newPassword: {
            message: "New password is required",
            isValid: formData.newPassword.length > 0,
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        let isError = false;

       
        setError({
            name: false,
            email: false,
            oldPassword: false,
            newPassword: false
        });

        
        for (const key of Object.keys(errorMessages)) {
            if (!errorMessages[key].isValid) {
                isError = true;
                setError((prev) => ({ ...prev, [key]: true }));
            }
        }

       
        if (!isError && userId) { 
            try {
                const res = await settings(userId, formData);
                if (res.status === 200) {
                    alert("Updated successfully");
                } else {
                    alert("Something went wrong: " + (res.data.message || "Please try again."));
                }
            } catch (error) {
                alert("An error occurred while updating: " + error.message);
            }
        }
    };

    return (
        <div className={styles.container}>
            <h1>Settings</h1>
            <form onSubmit={onSubmit} className={styles.form}>
                <div className={styles.field}>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    />
                    {error.name && <span className={styles.error}>{errorMessages.name.message}</span>}
                </div>

                <div className={styles.field}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    />
                    {error.email && <span className={styles.error}>{errorMessages.email.message}</span>}
                </div>

                <div className={styles.field}>
                    <input
                        type="password"
                        placeholder="Enter your old password"
                        value={formData.oldPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, oldPassword: e.target.value }))}
                    />
                    {error.oldPassword && <span className={styles.error}>{errorMessages.oldPassword.message}</span>}
                </div>

                <div className={styles.field}>
                    <input
                        type="password"
                        placeholder="Enter your new password"
                        value={formData.newPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, newPassword: e.target.value }))}
                    />
                    {error.newPassword && <span className={styles.error}>{errorMessages.newPassword.message}</span>}
                </div>

                <button type="submit" className={styles.submitButton}>Update</button>
            </form>
        </div>
    );
}
