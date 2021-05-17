import React, { useState, useCallback, useContext, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import { BookCard } from '../components/BookCard';
import { Loader } from '../components/Loader';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useQuery, gql } from '@apollo/client';

// BookItemPage
export const DetailPage = () => {
    const {token} = useContext(AuthContext);
    const [book, setBook] = useState(null);
    const bookId = useParams().id;

    const getBookQuery = gql`
    {
        book(id: "${bookId}"){
            id
            title
            author
            pages
            isbn
            owner
        }
    }
    `;

    const { loading, error, data } = useQuery(getBookQuery);

    if (error) console.log(`Error: ${error.message}`);

    const getBook = useCallback(() => {
        if(loading === false && data){
            setBook(data.book);
        }
    }, [data, loading])

    useEffect(() => {
        getBook();
    }, [getBook]);

    /*
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
    */

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            { !loading && book && <BookCard book={book} /> }
        </>
    );
}