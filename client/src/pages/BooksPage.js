import React, { useContext, useState, useCallback, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import {Loader} from '../components/Loader';
import {BooksList} from '../components/BooksList';
import { useQuery, gql, useMutation } from '@apollo/client';

export const BooksPage = () => {
    const [books, setBooks] = useState([]);
    const {userId} = useContext(AuthContext);

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
    mutation DeleteBook($id: ID!) {
        deleteBook(id: $id) {
          id
        }
      }
    `;

    const [deleteBookFunc] = useMutation(deleteBookMutation);

    const deleteBook = (id) => {
        deleteBookFunc({ variables: { id: id } });
        setBooks(books.filter(book => book.id !== id));
    };

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