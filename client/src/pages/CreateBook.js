import React, {useState, useEffect, useContext} from 'react';
import {useHistory} from "react-router-dom";
import {useHttp} from '../hooks/http.hook';
import {AuthContext} from '../context/AuthContext';
import { gql, useMutation } from '@apollo/client';

export const CreateBookPage = () => {
    const history = useHistory();
    const {userId} = useContext(AuthContext);
    const [book, setBook] = useState({
        title: "", author: "", pages: 0, isbn: ""
    });

    const addBookMutation = gql`
    mutation{
        addBook(
            title: "${book.title}", 
            author: "${book.author}", 
            pages: "${book.pages}", 
            isbn: "${book.isbn}", 
            owner: "${userId}"){
            id
        }
    }
    `;

    const [addBook, { data, loading, called }] = useMutation(addBookMutation);

    useEffect(() => {
        window.M.updateTextFields();
    }, []);

    const changeHandler = event => {
        setBook({ ...book, [event.target.name]: event.target.value })
    }

    const createHandler = async () => {
        addBook();
    };

    useEffect(() => {
        if (called && loading === false && data) {
            console.log(data);
            history.push(`/detail/${data.addBook.id}`);
        }
    }, [called, data, history, loading]);

    const pressHandler = async event => {
        if (event.key === "Enter") {
            createHandler();
        }
    }

    return (
        <div className="row">
            <div className="col s8 offset-s2">

                <div className="input-field">
                    <input placeholder="Book's title" 
                            id="title" 
                            name="title"
                            type="text"
                            value={book.title}
                           onChange={changeHandler}
                           onKeyPress={pressHandler}/>
                    <label htmlFor="title">Title</label>
                </div>

                <div className="input-field">
                    <input placeholder="Author" 
                            id="author" 
                            name="author"
                            type="text"
                            value={book.author}
                           onChange={changeHandler}
                           onKeyPress={pressHandler}/>
                    <label htmlFor="author">Author</label>
                </div>

                <div className="input-field">
                    <input placeholder="Pages" 
                            id="pages" 
                            name="pages"
                            type="number"
                            value={book.pages}
                           onChange={changeHandler}
                           onKeyPress={pressHandler}/>
                    <label htmlFor="pages">Pages</label>
                </div>

                <div className="input-field">
                    <input placeholder="ISBN" 
                            id="isbn" 
                            name="isbn"
                            type="text"
                            value={book.isbn}
                           onChange={changeHandler}
                           onKeyPress={pressHandler}/>
                    <label htmlFor="isbn">ISBN</label>
                </div>

                <button 
                    className="btn waves-effect waves-light btn-small"
                    onClick={createHandler}
                >
                    Create
                </button>
                
            </div> 
        </div>
    );
}