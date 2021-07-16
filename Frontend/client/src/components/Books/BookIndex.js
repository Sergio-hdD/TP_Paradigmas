import { useContext } from 'react';
import { DataContext } from '../../store/GlobalState'
import MUIDataTable from 'mui-datatables';
import Grid from '@material-ui/core/Grid'

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
                sort: false,
            }
        },
        {
            name: "price",
            label: "Price",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "inStock",
            label: "Stock",
            options: {
                filter: true,
                sort: false,
            }
        },
    ];

    const options = {
        filterType: 'checkbox',
    };


    return (
        <Grid container justifyContent="center" style={{ marginTop: '30px' }}>
            <Grid item xs="12" md="10">
                <MUIDataTable
                    title={"Books List"}
                    data={books}
                    columns={columns}
                    options={options}
                />
            </Grid>
        </Grid>

    )
}

export default BookIndex