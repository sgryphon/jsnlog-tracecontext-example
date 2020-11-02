import { JL } from "jsnlog";
import React, { PureComponent } from "react";
import opentelemetry from '@opentelemetry/api'
import { BasicTracerProvider } from '@opentelemetry/tracing'
import { WebTracerProvider } from '@opentelemetry/web'

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
    // const traceId = '0af7651916cd43dd8448eb211c80319c'
    // const spanId = 'b7ad6b7169203331'

    const tracerProvider = new WebTracerProvider();
    //const tracerProvider = new BasicTracerProvider();
    tracerProvider.register();

    const tracer = opentelemetry.trace.getTracer('default');
    const span = tracer.startSpan('foo');
    const spanContext = span.context();
    console.info(`traceId=${spanContext.traceId}, spanId=${spanContext.spanId}`)

    // JS duck-typing means I can just pass in the OpenTelemetry context to JSNLog, as they use the same property names
    JL('Client.Weather').info('Populate weather data', spanContext)

    // Use OpenTelemetry to inject the headers (correct format, etc)
    const headers = {};
    tracer.withSpan(span, () => {
      opentelemetry.propagation.inject(headers);
    });

    const response = await fetch('weatherforecast', { headers: headers});
    const data = await response.json();
    this.setState({ forecasts: data });

    span.end()
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