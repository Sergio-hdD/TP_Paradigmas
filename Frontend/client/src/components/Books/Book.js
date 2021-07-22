import Container from '@material-ui/core/Container';
import { useEffect, useState } from 'react';
import { getData } from '../../utils/fetchData'
import BookItemList from './BookItemList';

const Book = ({ match }) => {

    const [book, setBook] = useState({})

    useEffect(() => {
        getData(`books/${match.params.id}`).then(res => {
            setBook(res)
        })
    }, [match.params.id])

    if (!book.title) return null;

    return (
        <Container maxWidth="md" component="main">
            <BookItemList book={book} />
        </Container>
    );

}

export default Book

