import React, { useState, useCallback, useContext, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import { BookCard } from '../components/BookCard';
import { Loader } from '../components/Loader';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import {socket} from '../socket'

// BookItemPage
export const DetailPage = () => {
    const {token} = useContext(AuthContext);
    const {request, loading} = useHttp();
    const [book, setBook] = useState(null);
    const bookId = useParams().id;
    
    const getBook = useCallback(async () => {
        try {
            socket.emit("user:auth", token, (callback) => {
                if (callback.ok) {
                    socket.emit("book:read", bookId, (callback) => {  
                        if (callback.success) {
                            setBook(callback.book);
                        } else {
                            console.log(callback.message);
                        }
                    });
                } else {
                    console.log(callback.message);
                }
            });
        } catch (e) {}

        /*
        try {
            const fetched = await request(`/api/book/${bookId}`, "GET", null, {
                Authorization: `Bearer ${token}`
            });
            setBook(fetched);
        } catch (e) {
            
        }
        */
    }, [bookId, token]);

    useEffect(() => {
        getBook();
    }, [getBook]);

    useEffect(() => {
        if (socket.disconnected) {
            socket.connect();
        }
        return () => {
            socket.emit("break", {message: "CreateBook disconnected"})
            socket.disconnect()
        };
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            { !loading && book && <BookCard book={book} /> }
        </>
    );
}