import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import BeersResponsiveBar from './components/BeersResponsiveBar';
import dayjs from 'dayjs';

function App() {
  const [beers, setBeers] = useState([]);
  const [sortedBeers, setSortedBeers] = useState({});

  useEffect(() => {
    const getBeers = async () => {
      const request = await axios.get('https://api.punkapi.com/v2/beers');
      setBeers(request.data);

      const temp = {};

      request.data.forEach((beer) => {
        const [month, year] = beer.first_brewed.split('/');
        const d = new Date(year, month, 1);
        const date = dayjs(d, 'DD/MM/YYYY').format('MMM YY');

        if (temp.hasOwnProperty(date)) {
          if (temp[date].hasOwnProperty(beer.abv))
            temp[date][beer.abv] += beer.volume.value;
          else temp[date][beer.abv] = beer.volume.value;
        } else {
          temp[date] = {};
          temp[date][beer.abv] = beer.volume.value;
        }
      });

      const result = [];
      for (const prop in temp) {
        let sum = 0;
        for (const val in temp[prop]) {
          sum += temp[prop][val];
        }
        result.push({ date: prop, volume: sum });
      }

      setSortedBeers(result);
    };

    getBeers();
  }, []);

  // {date:'12/2015', '5.3': 20, '7.5': 20}, '12/2017':}

  return (
    <div className="App">
      <BeersResponsiveBar data={sortedBeers} />
    </div>
  );
}

export default App;
