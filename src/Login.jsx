import { useRef, useState, useEffect, useContext } from 'react';

import axios from 'axios';
import AuthContext from "./backend/AuthProvider.jsx";
import { Outlet, Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const LOGIN_URL = 'http://localhost:3500/auth';

const Login = () => {

    const navigate = useNavigate(); // Initialize useNavigate

    const { setAuth } = useContext(AuthContext);

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                LOGIN_URL,
                { username: user, password: pwd  }, // sending data as an object, no need to stringify
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true // sending cookies with CORS requests
                }
            );

            console.log('Login successful:', response.data);


           // const accessToken = response.data.accessToken;
            setAuth(true);
            localStorage.setItem("auth", JSON.stringify(true));

            setUser('');
            setPwd('');
            setSuccess(true);

            navigate('/todo');

        } catch (err) {
            if (!err.response) {
                setErrMsg('No Server Response');
            } else if (err.response.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }

            errRef.current.focus();
        }
    };
    return (
        <>
            {success ? (
                <p>success</p>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Sign In</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />
                        <button>Sign In</button>
                    </form>
                    <p>
                        Need an Account?<br/>
                        <span className="line">
                            <Link to="/register">Sign Up</Link>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Login