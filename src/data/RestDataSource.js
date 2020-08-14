import axios from "axios";
import moment from 'moment';
import data from '../mockData/finalData.json';
import getDistanceFromLatLonInKm from '../util';
import { API_KEY } from '../config';

export default class RestDataSource {

    GetTrafficImagesHardcoded = async (date, dataCallback, errCallback) => {
        const finalData = data.map(d =>
            d.weather === null ? { ...d, sortkey: d.roadName } : { ...d, sortkey: d.weather.areaName }
        );

        finalData.sort((a, b) => (a.sortkey > b.sortkey) ? 1 : -1);
        //console.log(JSON.stringify(finalData));
        //console.log(finalData);
        dataCallback(finalData);
    }

    GetTrafficImages = async (date, dataCallback, errCallback) => {
        let trafficImagesResponse = await axios.get("https://api.data.gov.sg/v1/transport/traffic-images?date_time=" + moment(date).format("YYYY-MM-DDTHH:mm:ss"));
        let items = trafficImagesResponse.data.items;
        if (items === null || items.length === 0 || !("cameras" in items[0]) || items[0].cameras.length === 0) {
            errCallback("no traffic image data found");
        }
        else {
            const cameraData = []
            const requests = items[0].cameras.map((camera) => {
                return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${API_KEY}&latlng=${camera.location.latitude},${camera.location.longitude}`)
                    .then(res => {cameraData.push({ ...camera, roadName: res.data.results[0].formatted_address })})
                    .catch(err => {
                        console.error(err);
                        cameraData.push({ ...camera, roadName: `Unknown Name (${camera.camera_id})` });
                    })
            });
            await Promise.all(requests);

            let weatherForecastResponse = await axios.get("https://api.data.gov.sg/v1/environment/2-hour-weather-forecast?date_time=" + moment(date).format("YYYY-MM-DDTHH:mm:ss"));
            let weatherData = weatherForecastResponse.data;
            const data = cameraData.map((camera) => {
                if (weatherData !== null && weatherData.area_metadata.length > 0) {
                    let min = weatherData.area_metadata[0];
                    let minValue = getDistanceFromLatLonInKm(camera.location.latitude, camera.location.longitude, min.label_location.latitude, min.label_location.longitude);
                    for (let i = 1; i < weatherData.area_metadata.length; i++) {
                        let value = getDistanceFromLatLonInKm(
                            camera.location.latitude,
                            camera.location.longitude,
                            weatherData.area_metadata[i].label_location.latitude,
                            weatherData.area_metadata[i].label_location.longitude);
                        if (value < minValue) {
                            minValue = value;
                            min = weatherData.area_metadata[i]
                        }
                    }

                    const weatherInfo = weatherData.items[0].forecasts.filter(e => e.area === min.name)[0].forecast;
                    return {
                        ...camera,
                        weather: {
                            areaName: min.name,
                            forecast: weatherInfo,
                            validPeriod: {
                                start: weatherData.items[0].valid_period.start,
                                end: weatherData.items[0].valid_period.end,
                            }
                        }
                    }
                }
                else {
                    return { ...camera, weather: null }
                }

            });

            //console.log(JSON.stringify(data));
            const finalData = data.map(d =>
                d.weather === null ? { ...d, sortkey: d.roadName } : { ...d, sortkey: d.weather.areaName }
            );

            finalData.sort((a, b) => (a.sortkey > b.sortkey) ? 1 : -1);

            dataCallback(finalData);


        }
    }
}