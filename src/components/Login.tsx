import { useState } from "react";
import styles from "../styles/login.module.css";

interface LoginProps {
    onSubmit: (email: string, password: string) => void;
    isLoading: boolean;
}

export default function Login({ onSubmit, isLoading }: LoginProps) {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSubmit = () => {
        onSubmit(email, password);
    };

    return (
        <div className={styles.loginBlock}>
            <input
                className={styles.inputField}
                type="text"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className={styles.inputField}
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={styles.submitButton}
            >
                {isLoading ? "Processing..." : "Login"}
            </button>
        </div>
    );
}
