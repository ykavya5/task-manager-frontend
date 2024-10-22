import Form from "../../components/form";
import { useState } from "react";
import { register } from "../../services/auth";
import { useNavigate, Link } from "react-router-dom";
import loginImg from "../../assests/image.png";
import styles from "./register.module.css";


export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false
    });
    const formFields = [{
        name: "name",
        type: "text",
        placeholder: "Enter your name",
        value: formData.name,
        onChange: (e) => {
            setFormData({ ...formData, name: e.target.value })
        }
    },
    {
        name: "email",
        type: "email",
        placeholder: "Enter your email",
        value: formData.email,
        onChange: (e) => {
            setFormData({ ...formData, email: e.target.value })
        }
    },
    {
        name: "password",
        type: "password",
        placeholder: "Enter your password",
        value: formData.password,
        onChange: (e) => {
            setFormData({ ...formData, password: e.target.value })
        }
    }, {
        name: "confirmPassword",
        type: "password",
        placeholder: "Confirm your password",
        value: formData.confirmPassword,
        onChange: (e) => {
            setFormData({ ...formData, confirmPassword: e.target.value })
        }
    }

    ]
    const errorMessages = {
        name: {
            message: "Name is required",
            isValid: formData.name.length > 0,
            onError: () => {
                setError((error) => ({ ...error, name: true }))
            }
        },
        email: {
            message: "Email is required",
            isValid: formData.email.length > 0,
            onError: () => {
                setError((error) => ({ ...error, email: true }))
            }
        },
        password: {
            message: "Password is required",
            isValid: formData.password.length > 0,
            onError: () => {
                setError((error) => ({ ...error, password: true }))
            }
        },
        confirmPassword: {
            message: "Passwords do not match",
            isValid: formData.confirmPassword === formData.password,
            onError: () => {
                setError((error) => ({ ...error, confirmPassword: true }))
            }
        }
    }
    const onSubmit = async (e) => {
        let isError = false;
        e.preventDefault();
        Object.keys(errorMessages).forEach(key => {
            if (!errorMessages[key].isValid) {
                isError = true;
                errorMessages[key].onError();
            }
        })
        if (!isError) {
            const res = await register(formData);
            if (res.status === 200) {
                alert("Registered successfully");
                navigate("/login");
            }
            else {
                alert("Something went wrong");
            }
        }
    }

    return (
        <>
            <div className={styles.regContainer}>
                <div className={styles.leftContainer}>
                    <img src={loginImg} alt="Login" className={styles.loginImage} />
                </div>
                <div className={styles.rightContainer}>
                    <div className={styles.rCont}>
                    <h1 className={styles.loginTitle}>Register</h1>
                    <Form formFields={formFields}
                        onSubmit={onSubmit} error={error}
                        errorMessages={errorMessages}
                        submitLabel="Register" />
                         <p className={styles.account}> Have an account ? </p>
                         <Link className={styles.loginbtn} to="/login">Log In</Link>
                </div>
            </div>
        </div >
        </>
    )
}