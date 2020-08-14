import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import moment from 'moment';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import RestDataSource from './data/RestDataSource';
import { fade, makeStyles } from '@material-ui/core/styles';
import Body from './components/Body';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    textAlign: 'center',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  textField: {
    padding: theme.spacing(0, 2),
    height: '100%',
    marginLeft: theme.spacing(1),
    width: 300,
  },
  buttonProgress: {
    color: theme.palette.info,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function App() {
  const classes = useStyles();
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [trafficImages, setTrafficImages] = useState(null);
  const [trafficImagesLoading, setTrafficImagesLoading] = useState(false);
  const [searchedSelectedDateTime, setSearchedSelectedDateTime] = useState(null);
  const [transitionState, setTransitionState] = useState({
    open: false,
    Transition: Fade,
    message: ""
  })

  const defaultDate = moment(new Date()).format("YYYY-MM-DDTHH:mm");

  const search = () => {
    if (!trafficImagesLoading) {
      setTrafficImagesLoading(true);
      new RestDataSource().GetTrafficImages(
        selectedDateTime,
        data => {
          setTrafficImages(data);
          setTrafficImagesLoading(false);
          setSearchedSelectedDateTime(selectedDateTime);
        },
        errMsg => {
          setTransitionState({ open: true, Transition: Fade, message: errMsg});
          setTrafficImagesLoading(false);
        });
    }
  }

  const closeSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setTransitionState({ open: false, Transition: Fade });
  }

  return (
    <React.Fragment><CssBaseline />
    
      <Box className={classes.grow}>

        <AppBar position="static">
          <Toolbar>
            <Typography className={classes.title} variant="h6" noWrap>
              Traffic Images
            </Typography>
            <Box className={classes.search}>
              <TextField
                id="datetime-local"
                label="Image Date Time"
                type="datetime-local"
                defaultValue={defaultDate}
                className={classes.textField}
                onChange={(evt) => setSelectedDateTime(moment(evt.target.value))}
                InputLabelProps={{
                  shrink: true,
                }} />
              <IconButton aria-label="search"
                color="inherit"
                onClick={search}
                disabled={trafficImagesLoading}>
                <SearchIcon />
                {trafficImagesLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
              </IconButton>

            </Box>
          </Toolbar>
        </AppBar>
        <Body
          data={trafficImages}
          selectedDateTime={searchedSelectedDateTime}
          showError={(errMsg) => setTransitionState({ open: true, Transition: Fade, message: errMsg})}
         />
        <Snackbar
          open={transitionState.open}
          onClose={closeSnackBar}
          TransitionComponent={transitionState.Transition}
          autoHideDuration={3500}
        >
          <Alert onClose={closeSnackBar} severity="error">
            {transitionState.message}
          </Alert>
        </Snackbar>
      </Box>
    </React.Fragment>
  );
}
