import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { Link } from 'react-router-dom'
import FolderIcon  from '@material-ui/icons/ShoppingCart'

const Navbar = () => {
    return (
        <AppBar position="relative">
            <Toolbar>
                <Grid
                    justifyContent="space-between"
                    container
                >
                    <Grid item>
                        <Typography variant="h6" color="inherit" noWrap style={{ marginLeft: '10px' }}
                        component={Link} to={'/'}>
                            Books App
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Button color="inherit" component={Link} to={'/cart'}>
                            <FolderIcon/>
                        </Button>
                        <Button color="inherit" component={Link} to={'/register'}>
                            Register
                        </Button>
                        <Button color="inherit" component={Link} to={'/login'}>
                            Login
                        </Button>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar