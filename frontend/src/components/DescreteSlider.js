import * as React from 'react';
import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const IOSSlider = withStyles({
  root: {
    color: '#2d2047',
    height: 2,
    padding: '15px 0',
  },
  thumb: {
    height: 20,
    width: 20,
    backgroundColor: '#fff',
    boxShadow: iOSBoxShadow,
    marginTop: -10,
    marginLeft: -14,
    '&:focus, &:hover, &$active': {
      boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
      },
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 6px)',
    top: -18,
    '& *': {
      background: 'transparent',
      color: '#000',
    },
  },
  track: {
    height: 2,
  },
  rail: {
    height: 2,
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
  mark: {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    marginTop: -3,
  },
  markLabel: {
    fontSize: 12,
    top: 30,
  },
  markActive: {
    opacity: 1,
    backgroundColor: '#bfbfbf',
  },
})(Slider);

//width: 20, height: 20, marginTop: -8, boxShadow: '0px 1px 7px #999',

function valuetext(value) {
  return `${value}%`;
}

export default function DiscreteSlider(props) {
  return (
    <Box style={{ margin: '12px 0 12px 0'}}>
      <Typography gutterBottom style={{ marginTop: 0, marginBottom: 12, paddingLeft: 0, fontSize: 12, }}>{props.name} { props.locked ? <span style={{ position: 'relative'}}><LockIcon onClick={() => props.onLock(false)} style={{ cursor: 'pointer', fontSize: 16, position: 'absolute', left: 8, top: -3, }} /></span> : <span style={{ position: 'relative' }}><LockOpenIcon onClick={() => props.onLock(true)} style={{ cursor: 'pointer', fontSize: 16, position: 'absolute', left: 8, top: -3, }} /></span> }</Typography>
      <div style={{pointerEvents: props.locked ? 'none' : 'auto'}}>
      <IOSSlider
        aria-label="transport_mode"
        getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        id={props.id}
        defaultValue={props.defaultValue}
        // onChangeCommitted={(e, value) => { console.log(props.id, value)}}
        onChangeCommitted={
          (e, value) => {
            if(!props.locked) {
              if(props.max >= value) { props.onChange(value); }
              else {
                document.querySelector(`#${props.id} .MuiSlider-track`).style.width = props.max + '%';
                document.querySelectorAll(`#${props.id} .MuiSlider-markLabel`).forEach(item => { if(parseInt(item.style.left) > parseInt(props.max)) { item.classList.remove('MuiSlider-markLabelActive') } })
                e.target.style.left = props.max + '%';
                props.onChange(props.max);  
              }
            }

          }}
        step={1}
        style={{ color: '#2d2047', maxWidth: 260, marginLeft: 0,}}
        marks={
          [
            {
              value: 0,
              label: '0%',
            },
            {
              value: 20,
              label: '20%',
            },
            {
              value: 40,
              label: '40%',
            },
            {
              value: 60,
              label: '60%',
            },
            {
              value: 80,
              label: '80%',
            },
            {
              value: 100,
              label: '100%',
            },
          ]
        }
        min={0}
        max={100}
      />
      </div>
    </Box>
  );
}