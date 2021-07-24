import { useContext, useState } from 'react';
import { DataContext } from '../../store/GlobalState'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { validRegister } from '../../utils/valid';
import { postData } from '../../utils/fetchData';

const Register = () => {

    const { dispatch } = useContext(DataContext)

    const [user, setUser] = useState({
        username: '',
        email: '',
        password: '',
        cf_password: ''
    })

    const handleChangeInput = e => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value })
    }

    const handleSubmit = async e => {
        e.preventDefault()

        const errorMsg = validRegister(user.username, user.email, user.password, user.cf_password);

        if (errorMsg) {
            return dispatch({ type: 'NOTIFY', payload: { error: errorMsg, show: true } })
        }

        const res = await postData('users/register', user)

        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err, show: true } })

        dispatch({ type: 'NOTIFY', payload: { success: res.msg, show: true } })

    }

    const useStyles = makeStyles((theme) => ({
        root: {
            height: '100vh',
        },
        image: {
            backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundRepeat: 'no-repeat',
            backgroundColor:
                theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        },
        paper: {
            margin: theme.spacing(7, 4),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        avatar: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main,
        },
        form: {
            width: '100%',
            marginTop: theme.spacing(1),
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
        },
    }));

    const classes = useStyles();

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Register
                    </Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            onChange={handleChangeInput}
                            value={user.username}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={handleChangeInput}
                            value={user.email}
                        />

                        <Grid container>
                            <Grid item md={6} xs={12} style={{paddingRight: '4px'}}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    fullWidth
                                    onChange={handleChangeInput}
                                    value={user.password}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    name="cf_password"
                                    label="Confirm Password"
                                    type="password"
                                    id="password"
                                    fullWidth
                                    autoComplete="current-password"
                                    onChange={handleChangeInput}
                                    value={user.cf_password}
                                />
                            </Grid>

                        </Grid>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Register
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link to="/login" variant="body2">
                                    {"Don't have an account? Login"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Grid>
        </Grid>
    )
}

export default Register