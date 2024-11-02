import Form from "../../components/form";
import { useState } from "react";
import { Link } from 'react-router-dom';
import loginImg from "../../assests/image.png";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth";
import styles from "./login.module.css";
export default function Login() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    if (token) {
        navigate("/");
    }
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState({
        email: false,
        password: false,
    });
    const formFields = [
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
        },
    ]
    const errorMessages = {
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
           
                const res = await login(formData);
                console.log(res);
                
                if (res.status === 200) {
                    alert("Logged in successfully");
                    const token = res.data.token;
                    localStorage.setItem("token", token);
                    navigate("/");
                }
           
        }
    }
    const submitLabel =  "Log In";
    return (
        <div className={styles.loginContainer}>
            <div className = {styles.leftContainer}>
                <img src={loginImg} alt="Login" className={styles.loginImage} />
            </div>
            <div className = {styles.rightContainer}>
                <div className = {styles.rCont}>
                <p className={styles.loginTitle}>Login</p>
                <Form
                    error={error}
                    formFields={formFields}
                    onSubmit={onSubmit}
                    errorMessages={errorMessages}
                    submitLabel={submitLabel}
                />
                <p className={styles.noaccount}> Have no account yet? </p>
                <Link className={styles.registerbtn} to="/register">Register</Link>
                  </div>
            </div>
        </div>
    );
}