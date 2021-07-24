import { useContext, useState } from 'react'
import { updateItem } from '../store/Actions'
import { DataContext } from '../store/GlobalState'
import { postData, putData } from '../utils/fetchData'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/EditRounded';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import CardContent from '@material-ui/core/CardContent'
import Container from '@material-ui/core/Container'
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';


const Categories = () => {

    const [name, setName] = useState('')

    const { state, dispatch } = useContext(DataContext)

    const { categories, auth } = state

    const [id, setId] = useState('')

    const useStyles = makeStyles((theme) => ({
        root: {
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            margin: 'auto',
            marginBottom: '10px'
        },
        input: {
            marginLeft: theme.spacing(1),
            flex: 1,
        },
        iconButton: {
            padding: 10,
        },
        divider: {
            height: 28,
            margin: 4,
        },
    }));

    const classes = useStyles();

    const createCategory = async () => {

        if (!auth.user.isAdmin) return dispatch({ type: 'NOTIFY', payload: { error: 'Authentication is not valid.', show: true } })

        if (!name) return dispatch({ type: 'NOTIFY', payload: { error: 'Name is required.', show: true } })

        let res;

        if (id) {
            res = await putData(`categories/${id}`, { name })

            if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err, show: true } })
            dispatch(updateItem(categories, id, res.category, 'ADD_CATEGORIES'))

        } else {
            res = await postData('categories', { name })

            if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err, show: true } })

            dispatch({ type: "ADD_CATEGORIES", payload: [...categories, res.newCategory] })
        }

        setId('')
        setName('')
        return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
    }

    const handleEditCategory = async (category) => {
        setId(category.id)
        setName(category.name)
    }

    return (
        <Container maxWidth="md" component="main">
            <Grid container spacing={4} justifyContent="center" style={{ marginTop: '20px' }}>

                <Grid item xs={12} sm={12} md={8}>
                    <Card>
                        <CardContent>

                            <Paper className={classes.root}>
                                <InputBase
                                    className={classes.input}
                                    placeholder="Add a new category"
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                />
                                <Divider className={classes.divider} orientation="vertical" />
                                <IconButton type="submit" className={classes.iconButton} onClick={createCategory} aria-label="search">
                                    {id ? <EditIcon /> : <AddIcon />}
                                </IconButton>
                            </Paper>

                            <List dense>
                                {
                                    categories.map((category, index) => (
                                        <Typography variant="subtitle1" align="center">
                                            <ListItem key={index} button>
                                                <ListItemAvatar>
                                                    <Avatar
                                                        alt="https://source.unsplash.com/random"
                                                        src="https://source.unsplash.com/random"
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText id={index} primary={category.name} />
                                                <ListItemSecondaryAction>
                                                    <IconButton>
                                                        <EditIcon onClick={() => handleEditCategory(category)} />
                                                    </IconButton>
                                                    <IconButton>
                                                        <DeleteIcon onClick={() => dispatch({
                                                            type: 'ADD_MODAL',
                                                            payload: [{ data: categories, id: category.id, title: category.name, type: 'ADD_CATEGORIES', show: true }]
                                                        })}
                                                        />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            <Divider />
                                        </Typography>
                                    ))
                                }
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

        </Container>
    )
}

export default Categories