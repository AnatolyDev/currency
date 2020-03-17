import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import {XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, LineSeries} from 'react-vis';

const App = () => {

  const [i, setI] = useState(0);

  const [USDcur, setUSDcur] = useState(undefined);
  const [RURcur, setRURcur] = useState(undefined);
  const [EURcur, setEURcur] = useState(undefined);

  const [USDarr, setUSDarr] = useState([]);
  const [RURarr, setRURarr] = useState([]);
  const [EURarr, setEURarr] = useState([]);

  const writeUSD = (x) => {
    setUSDcur(x);
  }

  const getCurrency = () => {
    async function getDataFromAPI(url) {
      try {
        const data = await axios.get(url);
        console.log(data.data.Valute);
        if (data.data && data.data.Valute && data.data.Valute.USD && data.data.Valute.USD.Value) {
          writeUSD(data.data.Valute.USD.Value);
          setUSDarr([...USDarr, {x : i, y : data.data.Valute.USD.Value}]);
        } else {
          setUSDcur(undefined)
        }
        
        data.data && data.data.Valute && data.data.Valute.RUR && data.data.Valute.RUR.Value ? setRURcur(data.data.Valute.RUR.Value) : setRURcur(undefined);
        data.data && data.data.Valute && data.data.Valute.EUR && data.data.Valute.EUR.Value ? setEURcur(data.data.Valute.EUR.Value) : setEURcur(undefined);
      } catch(error) {
        console.log(error)
      };
    }
    getDataFromAPI('https://www.cbr-xml-daily.ru/daily_json.js');
  }

  useEffect(
    () => {
      const timerId = setInterval(
        () => {
          getCurrency();
        },
        2000
      );
      return () => {
        clearInterval(timerId);
      }
    },
    []
  )

  return (
    <div className="App">
      <div>
        <table>
          <caption>Таблица курсов валют</caption>
          <thead>
            <tr>
              <th>
                USD
              </th>
              <th>
                RUR
              </th>
              <th>
                EUR
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {USDcur ? USDcur : '=='}
              </td>
              <td>
                {RURcur ? RURcur : '=='}
              </td>
              <td>
                {EURcur}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <XYPlot height={300} width= {300}>
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <LineSeries data={USDarr} />
      </XYPlot>
    </div>
  );
}

export default App;
