import * as React from 'react';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import { Typography } from '@material-ui/core';

export default function MultipleOptions(props) {

  const initProps = {};

  props.options.forEach(option => {
    initProps[option.name] = props.init[option.name] || false;
  })

  const [state, setState] = React.useState(initProps);

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked
    });

    props.onChange({ ...state,
      [event.target.name]: event.target.checked
    });
  };

  return (
    <Box sx={{ display: 'flex', }} style={{ marginLeft: 0,}}>
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormGroup>
          {
            props.options && props.options.length && props.options.map(option => {
              return(
                <FormControlLabel
                key={option.name}
                control={
                  <Checkbox style={{
                    color: '#2d2047',
                    fontSize: 12,
                  }}
                  size={'small'} color={'primary'}
                  checked={state[option.name]}
                  onChange={handleChange}
                  name={option.name} />
                }
                label={<Typography style={{ fontFamily: 'DM Sans', fontSize: 12, }}>{option.label}</Typography>}
              />
              )
            })
          }
        </FormGroup>
        <FormHelperText style={{ fontSize: 9 }}>Mehrfachnennungen sind möglich</FormHelperText>
      </FormControl>
    </Box>
  );
}