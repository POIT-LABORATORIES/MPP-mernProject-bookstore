import React from 'react'

export const BookCard = ({ book }) => {
    return (
        <div className="s12 m4 l8">
            <h4>Title: {book.title}</h4>
            <h4>Author: {book.author}</h4>
            <h4>Pages: {book.pages}</h4>
            <h4>ISBN: {book.isbn}</h4>
        </div>
    );
}