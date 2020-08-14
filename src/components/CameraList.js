import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles((theme) => ({
    trafficImageList: {
        width: '100%',
        maxHeight: 250,
        [theme.breakpoints.up('sm')]: {
            maxHeight: 600,
        },
        overflow: 'auto',
        backgroundColor: theme.palette.background.paper
        

    },
    listItemText: {
        fontSize: theme.typography.body2,
        padding: theme.spacing(0, 0)
    },

}));

export default function CameraList(props) {
    const classes = useStyles();

    const mapListItem = (cameras) => {
        if (cameras) {
            return cameras.map((camera, index) => (
                <ListItem
                    button
                    selected={props.selected === index}
                    key={camera.camera_id}
                    onClick={() => props.onClick(index)}
                >
                    <ListItemText primary={camera.roadName} className={classes.listItemText} />
                </ListItem>

            ));
        }
    }
    return (

        <List className={classes.trafficImageList}>
            {mapListItem(props.cameras)}
        </List>

    )
}