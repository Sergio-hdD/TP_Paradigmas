import { useState, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { DataContext } from '../store/GlobalState'
import { deleteItem } from '../store/Actions'
import { deleteData } from '../utils/fetchData';

const ModalCustom = () => {

    const { state, dispatch } = useContext(DataContext)

    const { modal } = state

    const handleSubmit = () => {

        if (modal.length !== 0) {

            for (const item of modal) {

                if (item.type === 'ADD_CART') dispatch(deleteItem(item.data, item.id, item.type))

                if (item.type === 'DELETE_PRODUCT') deleteProduct(item)

                dispatch({ type: 'ADD_MODAL', payload: [{ show: false }] })

            }

        }

    }

    const deleteProduct = (item) => {
        
        deleteData(`books/${item.id}`)
            .then(res => {
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err, show: true } })

                dispatch(deleteItem(item.data, item.id, 'ADD_BOOKS'))

                return dispatch({ type: 'NOTIFY', payload: { success: res.msg, show: true } })
            }) 

        
    }


    const styles = (theme) => ({
        root: {
            margin: 0,
            padding: theme.spacing(2)
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('sm');

    const DialogTitle = withStyles(styles)((props) => {
        const { children, classes, onClose, ...other } = props;
        return (
            <MuiDialogTitle disableTypography className={classes.root} {...other}>
                <Typography variant="h6">{children}</Typography>
                {onClose ? (
                    <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </MuiDialogTitle>
        );
    });

    const DialogContent = withStyles((theme) => ({
        root: {
            padding: theme.spacing(2),
        },
    }))(MuiDialogContent);

    const DialogActions = withStyles((theme) => ({
        root: {
            margin: 0,
            padding: theme.spacing(1),
        },
    }))(MuiDialogActions);

    const handleClose = () => {
        dispatch({
            type: 'ADD_MODAL',
            payload: [{ show: false, type: 'ADD_CART' }]
        })
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={modal[0].show}
            fullWidth={fullWidth}
            maxWidth={maxWidth}>
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>{modal.length !== 0 && modal[0].title}</DialogTitle>
            <DialogContent dividers>
                <Typography gutterBottom>
                    Do you want to delete this item?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button autoFocus color="primary" onClick={() => handleSubmit()}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ModalCustom