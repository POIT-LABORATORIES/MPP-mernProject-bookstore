import {createContext} from 'react';

function noact() {}

export const AuthContext = createContext({
    token: null,
    userId: null,
    login: noact,
    logout: noact,
    isAuthenticated: false
});
