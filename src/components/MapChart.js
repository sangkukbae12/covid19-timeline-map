import React, { useState, useEffect } from 'react';
import { Paper, Grid, makeStyles } from '@material-ui/core';
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  ZoomableGroup,
} from 'react-simple-maps';
import * as d3 from 'd3';
import theme from '../theme';

const geoUrl =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json';

const useStyles = makeStyles({
  mapGrid: {
    maxWidth: '100%',
    height: '100%',
    maxHeight: '100vh',
  },
  mapPaper: {
    maxHeight: '90vh',
    marginTop: '1rem',
    overflow: 'hidden',
  },
  mapWrapper: {
    maxWidth: '1000px',
    margin: '-5% auto 0',
  },
});

const WorldMap = ({ data, date, setTooltipContent }) => {
  const [countryName, setCountryName] = useState();
  const classes = useStyles();

  useEffect(() => {
    async function getCountryName() {
      const data = await d3.csv(
        'https://gist.githubusercontent.com/sangkukbae/58e69ada4613feefd214f899339475e9/raw/CountryNameISO.csv'
      );
      const countryISOA3 = data.reduce((acc, cur) => {
        if (cur.ISO_A3 !== undefined) {
          acc[cur.ISO_A3] = cur.Country;
        }
        return acc;
      });
      setCountryName(Object.entries(countryISOA3));
    }
    getCountryName();
  }, []);

  const getMatchingCountryKey = (countryNames, geo) => {
    if (countryNames instanceof Array) {
      const ISO_A3 = geo.properties.ISO_A3;
      const c = countryNames.find((name) => name[0] === ISO_A3);
      if (c === undefined) {
        return;
      }
      return c[1];
    }
  };

  const getCountryData = (data, date, key) => {
    if (data && date && key !== undefined) {
      const newData = d3
        .nest()
        .key((d) => d.date)
        .entries(data);
      const countryData = newData.filter((d) => d.key === date.date);
      return countryData.map((d) => d.values[0][key]);
    } else {
      return;
    }
  };

  const colorScale = d3
    .scaleLog()
    .domain([1, 30000, 300000, 400000])
    .range(['#9575cd', '#673ab7', '#512da8', '#311b92']);

  return (
    <Grid item xs={12} className={classes.mapGrid}>
      <Paper className={classes.mapPaper}>
        <div className={classes.mapWrapper}>
          <ComposableMap width={800} height={600} data-tip="">
            <ZoomableGroup>
              <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countryKey = getMatchingCountryKey(countryName, geo);
                    const d = getCountryData(data, date, countryKey);
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() => {
                          const { NAME } = geo.properties;
                          if (+d > 0) {
                            setTooltipContent(
                              `${NAME} — Confirmed: ${d
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                            );
                          } else {
                            setTooltipContent(`${NAME} — Confirmed: 0`);
                          }
                        }}
                        onMouseLeave={() => {
                          setTooltipContent('');
                        }}
                        style={{
                          default: {
                            transition: 'fill 0.6s linear',
                            fill: +d > 0 ? colorScale(d) : '#ede7f6',
                            outline: 'none',
                          },
                          hover: {
                            fill: theme.palette.secondary.main,
                            outline: 'none',
                            cursor: 'pointer',
                          },
                          pressed: {
                            fill: theme.palette.secondary.dark,
                            outline: 'none',
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>
      </Paper>
    </Grid>
  );
};

export default WorldMap;
