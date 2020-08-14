import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
    areaName: {
        variant: 'h3',
        color: 'textPrimary'
    },
    dateTime: {
        variant: 'body2',
        color: 'textPrimary',
    },
    validPeriod: {
        variant: 'h6',
        color: 'textPrimary',
    },
    dateTimeNoData: {
        variant: 'body1',
        color: 'textPrimary'
    },
    noData: {
        variant: 'body2',
        color: 'textPrimary'
    }
  }));
  

export default function WeatherCard(props) {
    const classes = useStyles();
    return (
        <Box>
            {
                props && props.weather && (
                    <Card>
                        <CardContent>
                            <Typography color="textPrimary" variant="h3">
                                {props.weather.areaName}
                            </Typography>
                            <Typography color="textPrimary" variant="body2">
                                {moment(props.datetime).format("LLLL")}
                            </Typography>
                            <Typography color="textPrimary" variant="h6">
                                Forecast for {moment(props.weather.validPeriod.start).format("HH:mm")} to {moment(props.weather.validPeriod.end).format("HH:mm")}
                            </Typography>
                            <Typography color="textPrimary" variant="h5">
                                {props.weather.forecast}
                            </Typography>
                        </CardContent>
                    </Card>
                )}
            {
                !props.weather && (
                    <Card>
                        <CardContent>
                            <Typography color="textPrimary" variant="body1">
                                {moment(props.datetime).format("LLLL")}
                            </Typography>
                            <Typography color="textPrimary" variant="body2">
                                No weather information available
                        </Typography>
                        </CardContent>
                    </Card>
                )
            }

        </Box>
    )
}


