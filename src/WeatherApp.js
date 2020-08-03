import React from 'react';
import './WeatherApp.css';

// TODO - ADD: Temperature conversion - C -> F
// TODO - ADD: Add UI element for day/night
// TODO - ADD: Hourly slider
// TODO - ADD: Error message modals
// TODO - REMOVE: Search button, have it function of enter press

// colors for temp in C - 0-15 (blue), 16-26 (yellow), 27+ (red)

class WeatherApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: [],
            input: "",
            woeid: "",
            temp: null,
            conditions: "",
            abbreviation: "",
        };
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearchChange(event) {
        const inputValue = event.target.value;
        this.setState({
            input: inputValue,
        });
    }

    handleSearch = () => {
        this.setState({
            locations: [],
            input: "",
            woeid: "",
            temp: null,
            conditions: "",
            abbreviation: "",
        })
        var input = this.state.input;
        this.getLocationData(input);
    }

    getLocationData = (input) => {
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const url = "https://www.metaweather.com/api/location/search/?query=" + input;

        fetch(proxyurl + url)
        .then(res => res.json())
        .then((data) => {
            console.log(data);
            this.setState({ 
                locations: data[0],
                woeid: data[0].woeid,
            });
            this.getWeatherData(data[0].woeid);
        })
        .catch(console.log)
    }
    

    getWeatherData = (woeid) => {
        console.log("Retrieving weather data...");
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const url = "https://www.metaweather.com/api/location/" + woeid;
        fetch( proxyurl + url)
        .then(res => res.json())
        .then((data) => {
            console.log(data);
            this.setState({
                temp: Math.round(data.consolidated_weather[0].the_temp),
                conditions: data.consolidated_weather[0].weather_state_name,
                abbreviation: data.consolidated_weather[0].weather_state_abbr,
            });
        })
        .catch(console.log)
    }

    render() {
        return(
            // <div className="weather-app">
            <div className={(this.state.temp < 16) ? 'weather-app cold' : 'weather-app'}>
                <main>
                    <div className="search-box">
                        <input
                                type="text"
                                className = "search-field"
                                onChange = {this.handleSearchChange}
                                value = {this.state.input}
                                placeholder = "Enter city..."
                        />
                        <input type="submit" id="search-button" onClick = {this.handleSearch} value="Search"/>
                    </div>
                    {(this.state.temp != null) ? (
                        <div>
                            <div className="location-box">
                                <div className="location">{this.state.locations.title}</div>
                            </div>
                            <div className="weather-box">
                                <div className="temp">{this.state.temp}°C</div>
                                <div className="conditions">{this.state.conditions}</div>
                            </div>
                        </div>
                    ) : ("")}
                </main>
            </div>
        );
    }
}

export default WeatherApp