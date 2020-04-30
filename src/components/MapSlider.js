import React, { useState, useEffect, memo } from 'react';
import { Slider, IconButton, Grid, Paper, makeStyles } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';

const useStyles = makeStyles((theme) => ({
  valueLabel: {
    backgroundColor: 'transparent',
    color: theme.palette.secondary.main,
  },
  rail: {
    backgroundColor: '#bfbfbf',
  },
  mark: {
    backgroundColor: '#bfbfbf',
  },
}));

const MapSlider = ({ data, dateChangeHandler }) => {
  const [date, setDate] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [maxSliderValue, setMaxSliderValue] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    if (data) {
      const d = data.map((d) => d.date);
      setMaxSliderValue(d.length - 1);
      setSliderValue(d.length - 1);
    }
  }, [data]);

  useEffect(() => {
    if (data && sliderValue) {
      const d = data.map((d) => d.date);
      setDate(d[sliderValue]);
      dateChangeHandler(date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, date, sliderValue]);

  useEffect(() => {
    let s;
    if (playing) {
      if (sliderValue === maxSliderValue) {
        setPlaying(false);
      } else {
        s = setTimeout(() => {
          setSliderValue((prev) => prev + 1);
        }, 50);
      }
    }
    return () => clearTimeout(s);
  }, [playing, sliderValue, maxSliderValue]);

  const getSliderValueTextFunc = (data) => (value) => {
    if (data) {
      const d = data.map((d) => d.date);
      return d[value];
    }
  };

  return (
    <div style={{ position: 'fixed', left: '0', bottom: '0', width: '100vw' }}>
      <Paper variant="outlined" square>
        <Grid container alignItems="center">
          <Grid item xs={1} sm={1}>
            <IconButton
              onClick={() => {
                if (sliderValue === maxSliderValue) {
                  setSliderValue(0);
                }
                setPlaying(!playing);
              }}
            >
              {!playing ? <PlayArrowIcon /> : <StopIcon />}
            </IconButton>
          </Grid>
          <Grid item xs={10} sm={10}>
            <Slider
              classes={{
                valueLabel: classes.valueLabel,
                rail: classes.rail,
                mark: classes.mark,
              }}
              valueLabelFormat={getSliderValueTextFunc(data)}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              onChange={(event, newValue) => {
                setSliderValue(newValue);
              }}
              value={sliderValue}
              step={1}
              marks
              min={0}
              max={maxSliderValue}
            />
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default memo(MapSlider);
