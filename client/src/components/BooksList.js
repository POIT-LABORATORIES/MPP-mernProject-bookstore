import React from 'react';
import {Link} from 'react-router-dom';

export const BooksList = ({ books, deleteBook }) => {
    if (!books.length) {
        return <p className="center">
            There's no books yet
        </p>;
    }

    const deleteHandler = (event) => {
        event.preventDefault();
        try {
            let bookId = event.target.getAttribute("data-id");
            deleteBook(bookId);
        } catch (e) {
            console.log(e.message);
        }
    };


    return (
        <table>
            <thead>
            <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Pages</th>
                <th>ISBN</th>
            </tr>
            </thead>

            <tbody>
                {books.map((book) => {
                    return (
                        <tr key={book.id}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.pages}</td>
                            <td>{book.isbn}</td>
                            <td>
                                <Link to={`/detail/${book.id}`}>Open</Link>
                            </td>
                            <td>
                                <Link to={""} onClick={deleteHandler}>
                                    <button className="waves-effect waves-light btn-small red accent-3" data-id={book.id}>
                                        X
                                    </button>
                                </Link>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};