import React, { memo } from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import PublicIcon from '@material-ui/icons/Public';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
  })
);

const Header = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <PublicIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">
            COVID-19 MAP
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default memo(Header);
