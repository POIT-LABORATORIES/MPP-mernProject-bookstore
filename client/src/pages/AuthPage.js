import React, {useContext, useEffect, useState} from 'react';
import { AuthContext } from '../context/AuthContext';
import { useMessage } from '../hooks/authmsg.hook';
import { useHttp } from '../hooks/http.hook';

export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const message = useMessage();
    const {loading, error, request, clearError} = useHttp();
    const [form, setForm] = useState({
        email: "", password: ""
    });

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    useEffect(() => {
        window.M.updateTextFields();
    }, []);

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const registerHandler = async () => {
        try {
            const data = await request("/api/auth/register", "POST", {...form});
            message(data.message);
        } catch (e) {}
    };

    const loginHandler = async () => {
        try {
            const data = await request("/api/auth/login", "POST", {...form});
            auth.login(data.token, data.userId);
        } catch (e) {}
    };

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Auth</h1>
                <div className="card blue-grey darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Authorization</span>
                        <div>
                            <div className="input-field">
                                <input placeholder="Foo@ya.com" 
                                id="email" 
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={changeHandler}/>
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="input-field">
                                <input placeholder="pass" 
                                id="password" 
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={changeHandler}/>
                                <label htmlFor="password">Password</label>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button 
                        className="btn waves-effect waves-light btn-small"
                        onClick={loginHandler}
                        disabled={loading}
                        >
                            Sign in
                        </button>
                        <button 
                        className="btn waves-effect waves-light btn-small grey black-text"
                        onClick={registerHandler}
                        disabled={loading}
                        >
                            Sign up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}