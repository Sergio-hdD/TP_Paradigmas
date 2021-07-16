import { useState, useContext } from 'react';
import { DataContext } from '../store/GlobalState';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { Link } from 'react-router-dom'
import FolderIcon from '@material-ui/icons/ShoppingCart'
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core/styles';


const Navbar = () => {

    const { state, dispatch } = useContext(DataContext)

    const { auth } = state

    const loggedRouter = () => {
        return (
            <>
                <IconButton
                    onClick={handleMenu}
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    {
                        auth.user && auth.user.isAdmin && adminRouter()
                    }
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </>
        )
    }

    const adminRouter = () => {
        return [
            <MenuItem onClick={handleClose} component={Link} to="/books">Books</MenuItem>,
            <MenuItem onClick={handleClose}>Categories</MenuItem>
        ]
    }

    const handleLogout = () => {
        localStorage.clear()
        dispatch({type: 'AUTH', payload: {}})
        return dispatch({ type: 'NOTIFY', payload: {success: 'Logout Successfully', show: true } })
    }

    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <AppBar position="relative">
            <Toolbar>
                <Grid
                    justifyContent="space-between"
                    container
                >
                    <Grid item style={{ paddingTop: '8px' }}>
                        <Typography variant="h6" color="inherit" component={Link} to={'/'}>
                            Books App
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Button color="inherit" component={Link} to={'/cart'}>
                            <FolderIcon />
                        </Button>
                        {
                            !auth && (
                                <>
                                    <Button color="inherit" component={Link} to={'/register'}>
                                        Register
                                    </Button>
                                    <Button color="inherit" component={Link} to={'/login'}>
                                        Login
                                    </Button>
                                </>
                            )
                        }

                        {auth && loggedRouter()}
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar