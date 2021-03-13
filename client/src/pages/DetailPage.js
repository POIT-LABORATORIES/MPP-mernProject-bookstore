import React, { useState, useCallback, useContext, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import { BookCard } from '../components/BookCard';
import { Loader } from '../components/Loader';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';

// BookItemPage
export const DetailPage = () => {
    const {token} = useContext(AuthContext);
    const {request, loading} = useHttp();
    const [book, setBook] = useState(null);
    const bookId = useParams().id;
    const getBook = useCallback(async () => {
        try {
            const fetched = await request(`/api/book/${bookId}`, "GET", null, {
                Authorization: `Bearer ${token}`
            });
            setBook(fetched);
        } catch (e) {
            
        }
    }, [request, bookId, token]);

    useEffect(() => {
        getBook();
    }, [getBook]);

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            { !loading && book && <BookCard book={book} /> }
        </>
    );
}