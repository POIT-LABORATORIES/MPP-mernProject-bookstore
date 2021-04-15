import React, { useContext, useState, useCallback, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import {Loader} from '../components/Loader';
import {BooksList} from '../components/BooksList';
import {socket} from '../socket'

export const BooksPage = () => {
    const [books, setBooks] = useState([]);
    const {loading, request} = useHttp();
    const {token} = useContext(AuthContext);


    const deleteBook = useCallback(async (bookId) => {
        try {
            socket.emit("user:auth", token, (callback) => {
                if (callback.ok) {
                    socket.emit("book:delete", bookId, (response) => {  
                        if (response.isDeleted) {
                            let updatedBooks = books.filter(book => book._id !== bookId);
                            setBooks(updatedBooks);
                        } else {
                            console.log("Couldn't delete book with id = " + bookId);
                        }
                    });
                } else {
                    console.log(callback.message);
                }
            });
        } catch (e) {}
    }, [books, token]);

    const fetchBooks = useCallback(async () => {
        try {
            socket.emit("user:auth", token, (callback) => {
                if (callback.ok) {
                    socket.emit("book:readAllByUID", callback.userId, (callback) => {  
                        if (callback.success) {
                            setBooks(callback.books);
                        } else {
                            console.log(callback.message);
                        }
                    });
                } else {
                    console.log(callback.message);
                }
            });
        } catch (e) {}
    }, [token]);

    useEffect(() => {
        if (socket.disconnected) {
            socket.connect();
        }
        return () => {
            socket.emit("break", {message: "BookPage disconnected"})
            socket.disconnect()
        };
    }, []);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    if (loading) {
        return <Loader />;
    }


    return (
        <>
            {!loading && <BooksList books={books} deleteBook={deleteBook} />}
        </>
    );
    
}


/*
export const BooksPage = () => {
    const [books, setBooks] = useState([]);
    const {loading, request} = useHttp();
    const {token} = useContext(AuthContext);

    const socket = io("http://localhost:5000"); //!!!
    socket.emit("update item", "1", { name: "updated" }, (response) => {
        console.log(response.status); // ok
      });

    const deleteBook = useCallback(async (bookId) => {
        try {
            const fetched = await request(`api/book/${bookId}`, "DELETE", null, {
                Authorization: `Bearer ${token}`
            });
                
            let updatedBooks = books.filter(book => book._id !== fetched._id);
            setBooks(updatedBooks);
        } catch (e) {
            console.log(e.message);
        }
    }, [books, request, token]);

    const fetchBooks = useCallback(async () => {
        try {
            const fetched = await request("api/book", "GET", null, {
                Authorization: `Bearer ${token}`
            });
            setBooks(fetched);
        } catch (e) {
            
        }
    }, [request, token]);


    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    if (loading) {
        return <Loader />;
    }


    return (
        <>
            {!loading && <BooksList books={books} deleteBook={deleteBook} />}
        </>
    );
    
}
*/