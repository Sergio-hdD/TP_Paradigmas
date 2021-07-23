import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
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
import { validLogin } from '../../utils/valid';
import { getData, postData } from '../../utils/fetchData';

const Login = () => {

    const { state, dispatch } = useContext(DataContext)

    const { auth } = state

    const router = useHistory()

    useEffect(() => {
        if (auth.user) return router.push('/')
    }, [auth, router])

    const [user, setUser] = useState({
        email: '',
        password: ''
    })

    const handleChangeInput = e => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value })
    }

    const handleSubmit = async e => {
        e.preventDefault()

        const errorMsg = validLogin(user.email, user.password);

        if (errorMsg) return dispatch({ type: 'NOTIFY', payload: { error: errorMsg, show: true } })

        const res = await postData('users/login', user)

        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err, show: true } })

        dispatch({
            type: 'AUTH', payload: {
                token: res.access_token,
                user: res.user
            }
        })

        localStorage.setItem('jwt', res.access_token)

        getData('orders')
            .then(res => {
                if (res.msg) return dispatch({ type: 'NOTIFY', payload: { error: res.msg } })
                dispatch({ type: 'ADD_ORDERS', payload: res })
            })

        dispatch({ type: 'NOTIFY', payload: { success: 'logged Successfully', show: true } })

        router.push('/')

    }

    function Copyright() {
        return (
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" to="https://material-ui.com/">
                    Your Website
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
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
            margin: theme.spacing(8, 4),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        avatar: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main,
        },
        form: {
            width: '100%', // Fix IE 11 issue.
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
                        Login
                    </Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={user.email}
                            onChange={handleChangeInput}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={user.password}
                            onChange={handleChangeInput}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Login
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link to="/register" variant="body2">
                                    {"Don't have an account? Register"}
                                </Link>
                            </Grid>
                        </Grid>
                        <Box mt={5}>
                            <Copyright />
                        </Box>
                    </form>
                </div>
            </Grid>
        </Grid>
    )
}

export default Login