import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import {XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, LineSeries} from 'react-vis';

/*const arr = [
  {x:1, y:10},
  {x:2, y:15},
  {x:3, y:12},
  {x:4, y:17},
  {x:5, y:15}
]*/

const App = () => {

  // хуки для хранения текущих курсов валют 
  const [USDcur, setUSDcur] = useState(undefined);
  const [RURcur, setRURcur] = useState(undefined);
  const [EURcur, setEURcur] = useState(undefined);

  // хуки для хранения массивов курсов валют
  const [USDarr, setUSDarr] = useState([]);
  const [RURarr, setRURarr] = useState([]);
  const [EURarr, setEURarr] = useState([]);

  const [errorMes, setErrorMes] = useState(undefined);

  // основная функция чтения курсов из АПИ и складывания их в хуки
  const getCurrency = (startD) => {

    async function getDataFromAPI(url) {
      try {
        const data = await axios.get(url);
        setErrorMes(undefined);

        if (data.data && data.data.Valute && data.data.Valute.USD && data.data.Valute.USD.Value) {
          setUSDcur(data.data.Valute.USD.Value);
          setUSDarr(prevArr => [...prevArr, {x : (new Date()), y : data.data.Valute.USD.Value}]);
        } else {
          setUSDcur(undefined)
        }
        
        if (data.data && data.data.Valute && data.data.Valute.RUR && data.data.Valute.RUR.Value) {
          setRURcur(data.data.Valute.RUR.Value);
          setRURarr(prevArr => [...prevArr, {x : (new Date()), y : data.data.Valute.RUR.Value}]);
        } else {
          setRURcur(undefined);
        }

        if (data.data && data.data.Valute && data.data.Valute.EUR && data.data.Valute.EUR.Value) {
          setEURcur(data.data.Valute.EUR.Value);
          setEURarr(prevArr => [...prevArr, {x : (new Date()), y : data.data.Valute.EUR.Value}]);
        } else {
          setEURcur(undefined);
        }
      } catch(error) {
        console.log(error);
        error.message ? setErrorMes(error.message) : setErrorMes('Ошибка запроса данных');
      };
    }
    getDataFromAPI('https://www.cbr-xml-daily.ru/daily_json.js');
  }

  useEffect(
    () => {
      const startDate = new Date();
      const timerId = setInterval(
        () => {
          getCurrency(startDate);
        },
        5000
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
              <th style={{backgroundColor:'red'}}>
                USD
              </th>
              <th>
                RUR
              </th>
              <th style={{backgroundColor:'green'}}>
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
                {EURcur ? EURcur : '=='}
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
      <hr />
      {errorMes &&
        <h2 className='error-mes'>{errorMes}</h2>
      }
      {!errorMes &&
        <XYPlot height={300} width= {800} yDomain={[0, 100]} className='trend-area' >
          <VerticalGridLines style={{stroke: '#B7E9ED'}} />
          <HorizontalGridLines style={{stroke: '#B7E9ED'}} />
          <XAxis 
              tickFormat={function tickFormat(d){
                const date = new Date(d)
                return date.getHours() + ':' + date.getMinutes()
                }}
              title="Время"
              style={{
                line: {stroke: '#ADDDE1'},
                ticks: {stroke: '#ADDDE1'},
                text: {stroke: 'none', fill: '#6b6b76', fontWeight: 600}
              }}
              tickTotal={10}
          />
          <YAxis 
            
          />
          <LineSeries
            className="USD"
            color = "red"
            data={USDarr} 
          />

          <LineSeries
            className="EUR"
            color = "green"
            data={EURarr} 
          />
        </XYPlot>
      }
    </div>
  );
}

export default App;
