import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    position: 'absolute',
    left: 'calc(50% - 25px)',
    top: '50%',
    color: '#5FABE3',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  circle: {
    strokeLinecap: 'round',
    color: '#5FABE3',
  },
}));

export default function CircularIndeterminate(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress style={props.style ? props.style : {}} size={50} classes={{ circle: classes.circle}} />
    </div>
  );
}