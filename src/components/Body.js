import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import WeatherCard from './WeatherCard';
import CameraList from './CameraList';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';



const useStyles = makeStyles((theme) => ({

    sideGrid: {
        margin: 'none',
        [theme.breakpoints.up('sm')]: {
            margin: theme.spacing(2, 2),
        },
        textAlign: 'left'
    },
    img: {
        width: '100%',
        height: 'auto'
    },
    box: {
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        textAlign: 'center'
    },
    innerBox: {
        width: '100%',
        marginBottom: theme.spacing(1)
    },
    imagePaper: {
        padding: theme.spacing(1)
    }
}));

export default function Body(props) {
    const [cameraIndex, setCameraIndex] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const classes = useStyles();

    const handleImageLoad = () => setImageLoaded(true);
    const handleImageError = () => {
        props.showError("Unable to load Image");
        setImageError(true);
    }

    return (
        <Box className={classes.box}>
            {props.data && (
                <Grid container spacing={2} className={classes.sideGrid}>
                    <Grid item xs={12} sm={4}>
                        <Box className={classes.innerBox}>
                            <WeatherCard
                                weather={ props.data[cameraIndex] ? props.data[cameraIndex].weather : null }
                                datetime={props.selectedDateTime} />
                        </Box>

                        <Box className={classes.innerBox}>
                            <CameraList
                                cameras={props.data}
                                selected={cameraIndex}
                                onClick={(event) => {
                                    setCameraIndex(event);
                                    setImageLoaded(false);
                                    setImageError(false);
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                    
                        {!imageError && (
                            <Paper className={classes.imagePaper}>
                                {!imageLoaded && (<LinearProgress />)}
                                <img
                                    src={props.data[cameraIndex].image}
                                    className={classes.img}
                                    onLoad={handleImageLoad}
                                    onError={handleImageError}
                                    alt="trafficImage" /></Paper>
                        )}
                    </Grid>
                </Grid>)
            }
            {!props.data && (
                <Typography color="textSecondary" variant="body1">
                    Please search a date time to begin.
                </Typography>
            )}
        </Box>)

}