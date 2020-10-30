import React, { PureComponent } from "react";

export interface Forecast {
    date: string;
    temperatureC: string;
    temperatureF: string;
    summary: string;    
}

class WeatherComponent extends PureComponent<{}, { count: number, forecasts: Forecast[] }> {
  state = { count: 0, forecasts: [] };
  updateCount = (e: React.MouseEvent<HTMLButtonElement>): void => {
    switch (e.currentTarget.innerText) {
      case "-":
        this.setState({ count: this.state.count - 1 });
        break;
      case "+":
      default:
        this.setState({ count: this.state.count + 1 });
        break;
    }
  };
  populateWeatherData = async () => {
    const headers = { 
        'traceparent': '00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01'
    };
    const response = await fetch('weatherforecast', { headers: headers});
    const data = await response.json();
    this.setState({ forecasts: data });
  }
  static renderForecastsTable(forecasts: Forecast[]) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Date</th>
            <th>Temp. (C)</th>
            <th>Temp. (F)</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          {forecasts.map(forecast =>
            <tr key={forecast.date}>
              <td>{forecast.date}</td>
              <td>{forecast.temperatureC}</td>
              <td>{forecast.temperatureF}</td>
              <td>{forecast.summary}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }
  render(): JSX.Element {
    const { count, forecasts } = this.state;
    let contents = forecasts.length === 0 ? <p>Ready</p>
      : WeatherComponent.renderForecastsTable(this.state.forecasts);
    return (
      <div>
        <h2>Weather Component</h2>
        <button onClick={this.populateWeatherData}>Fetch</button>
        {contents}
      </div>
    );
  }
}
export default WeatherComponent;