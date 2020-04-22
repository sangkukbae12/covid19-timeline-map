import React, { useEffect, useState } from 'react';
import { Container } from '@material-ui/core';
import * as d3 from 'd3';
import Header from './components/Header';
import MapChart from './components/MapChart';
import MapSlider from './components/MapSlider';

import './App.css';
import ReactTooltip from 'react-tooltip';

function App() {
  const [data, setData] = useState(null);
  const [date, setDate] = useState(null);
  const [tooltipContent, setTooltipContent] = useState();

  useEffect(() => {
    async function getWorldData() {
      const worldCovid = await d3.csv(
        'https://covid.ourworldindata.org/data/ecdc/total_cases.csv'
      );
      setData(worldCovid);
    }

    getWorldData();
  }, []);

  const dateChangeHandler = (date) => {
    setDate((prev) => ({ ...prev, date }));
  };

  return (
    <div className="App">
      <Header />
      <Container maxWidth="xl">
        <MapChart
          data={data}
          date={date}
          setTooltipContent={setTooltipContent}
        />
        <ReactTooltip>{tooltipContent}</ReactTooltip>
      </Container>
      <MapSlider data={data} dateChangeHandler={dateChangeHandler} />
    </div>
  );
}

export default App;
