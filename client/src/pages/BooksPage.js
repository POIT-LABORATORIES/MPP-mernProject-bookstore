import React, { useContext, useState, useCallback, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import {Loader} from '../components/Loader';
import {BooksList} from '../components/BooksList';
import { useQuery, gql } from '@apollo/client';
const util = require('util')

export const BooksPage = () => {
    const [books, setBooks] = useState([]);
    //const {loading, request} = useHttp();
    const {request} = useHttp();
    const {token, userId} = useContext(AuthContext);
    let bookId;

    const getBooksQuery = gql`
    {
        books(ownerId: "${userId}"){
            id
            title
            author
            pages
            isbn
            owner
        }
    }
    `;

    const { loading, error, data } = useQuery(getBooksQuery);

    if (error) console.log(`Error: ${error.message}`);

    const deleteBookMutation = gql`
    mutation{
        deleteBook("${bookId}"){
            id
        }
    }
    `;

    const deleteBook = useCallback(async (id) => {
        bookId = id;
        
    }, []);

    /*
    const deleteBook = useCallback(async (bookId) => {
        try {
            const fetched = await request(`api/book/${bookId}`, "DELETE", null, {
                Authorization: `Bearer ${token}`
            });
                
            let updatedBooks = books.filter(book => book.id !== fetched._id);
            console.log(updatedBooks);
            setBooks(updatedBooks);
        } catch (e) {
            console.log(e.message);
        }
    }, [books, request, token]);
    */

    const getBooks = useCallback(() => {
        if(loading === false && data){
            let fetchedBooks = data.books.map(book => {
                return book
            });
            setBooks(fetchedBooks);
        }
    }, [data, loading])

    useEffect(() => {
        getBooks();
    }, [getBooks]);

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            {!loading && <BooksList books={books} deleteBook={deleteBook} />}
        </>
    );
}