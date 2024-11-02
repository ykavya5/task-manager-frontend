import styles from "./addpeople.module.css";
import { useState, useEffect } from "react";
import { addMembersToBoard, fetchAvailableUsers } from "../../services/board";

export default function AddPeople({ onClose, ownerId }) {
    const [availableUsers, setAvailableUsers] = useState([]);
    const [emailInput, setEmailInput] = useState("");
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [addedUserEmail, setAddedUserEmail] = useState(""); 

    useEffect(() => {
        const fetchData = async () => {
            try { 
                const users = await fetchAvailableUsers();
               
                const filteredUsers = users.filter(user => user._id !== ownerId);
                setAvailableUsers(filteredUsers);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [ownerId]);

    const handleAddPeople = async (e) => {
        e.preventDefault();
        setError(""); 
        setIsSuccess(false); 

        
        const userExists = availableUsers.some(user => user.email === emailInput);

        if (userExists) {
            try {
               
                const userToAdd = availableUsers.find(user => user.email === emailInput);
                await addMembersToBoard(userToAdd._id);
                setAddedUserEmail(userToAdd.email); 
                setIsSuccess(true);
                console.log("Member added successfully");
                setEmailInput(""); 
            } catch (error) {
                console.error("Error adding member:", error);
            }
        } else {
            setError("Email not found ");
        }
    };

    return (
        <div className={styles.modalContainer}>
            {!isSuccess ? (
                <>
                    <h2>Add People to Board</h2>
                    <form onSubmit={handleAddPeople} className={styles.form}>
                        <input
                            type="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder="Enter email"
                            className={styles.emailInput}
                            required
                        />
                        {error && <p className={styles.error}>{error}</p>}
                        <button type="submit" className={styles.addButton}>
                            Add
                        </button>
                        <button type="button" onClick={onClose} className={styles.closeButton}>
                            Close
                        </button>
                    </form>
                </>
            ) : (
                <div className={styles.successMessage}>
                    <h2>{addedUserEmail} added to the board</h2>
                    <button type="button" onClick={onClose} className={styles.closeButton}>
                        Okay, got it!
                    </button>
                </div>
            )}
        </div>
    );
}
