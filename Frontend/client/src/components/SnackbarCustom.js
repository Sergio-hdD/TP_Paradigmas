import React, { useContext } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { DataContext } from '../store/GlobalState'

const SnackbarCustom = ({ msg, handleShow, bgColor }) => {

    const { state, dispatch } = useContext(DataContext)
    const { notify } = state

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    const useStyles = makeStyles((theme) => ({
        root: {
            width: '100%',
            '& > * + *': {
                marginTop: theme.spacing(2),
            },
        },
    }));

    const classes = useStyles();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
    };


    return (
        <div className={classes.root}>
            <Snackbar open={notify.show} autoHideDuration={6000} onClose={() => dispatch({
                type: 'NOTIFY',
                payload: {
                    show: false
                }
            })}>
                <Alert onClose={handleClose} severity={bgColor}>
                    {msg.msg}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default SnackbarCustom