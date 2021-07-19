import { useContext } from 'react';
import { DataContext } from '../../store/GlobalState'
import MUIDataTable from 'mui-datatables';
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';

const BookIndex = () => {

    const { state } = useContext(DataContext)

    const { books } = state

    const columns = [
        {
            name: "title",
            label: "Title",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "description",
            label: "Description",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "price",
            label: "Price",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "inStock",
            label: "Stock",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "Actions",
            options: {
                filter: false,
                customBodyRender: (value, tableMeta, updateValue) => (
                    <FormControlLabel
                        control={<TextField value={value || ''} type='number' />}
                        onChange={event => updateValue(event.target.value)}
                    />
                )
            }
        }
    ];

    const options = {
        filterType: 'checkbox',
    };


    return (
        <Grid container justifyContent="center" style={{ marginTop: '30px' }}>
            <Grid item xs="12" md="10">
                <MUIDataTable
                    title={<Button variant="contained" component={Link} to="/books/new">Add Book</Button>}
                    data={books}
                    columns={columns}
                    options={options}
                />
            </Grid>
        </Grid>

    )
}

export default BookIndex