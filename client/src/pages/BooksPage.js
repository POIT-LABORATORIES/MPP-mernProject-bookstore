import React, { useContext, useState, useCallback, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import {Loader} from '../components/Loader';
import {BooksList} from '../components/BooksList';


export const BooksPage = () => {
    const [books, setBooks] = useState([]);
    const {loading, request} = useHttp();
    const {token} = useContext(AuthContext);

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