import * as React from 'react';
import Box from '@material-ui/core/Box';

import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Typography } from '@material-ui/core';

export default function CustomRadioGroup(props) {

  const [value, setValue] = React.useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
    props.onChange({ [event.target.value] : event.target.checked });
  };

  return (
    <Box style={{ marginLeft: 0, color: '#2d2047', fontFamily: 'DM Sans',}}>
      <FormControl component="fieldset" variant="standard">
        {/* <FormLabel component="legend">You can select mupltiple choices</FormLabel> */}
        <RadioGroup
          aria-label="gender"
          name="controlled-radio-buttons-group"
          value={value}
          onChange={handleChange}
        >
          {
            props.options && props.options.length && props.options.map(option => {
              return(
                <div style={{ marginBottom: 8, }} key={option.label + '_key'}>
                <FormControlLabel checked={props.init[option.name] ? true : false} key={option.name} value={option.name} control={<Radio size={'small'} style={{ color: '#2d2047',}} />} labelPlacement="end" label={<Typography style={{fontFamily: 'DM Sans', fontSize: 12, }}>{option.label}</Typography>} />
                { option.explanation ? <div style={{ fontSize: 9, color: 'rgba(0, 0, 0, 0.54)', margin: '0px 0 0 26px', padding: 0, }}>{option.explanation}</div>  : ''}
                </div>
              )
            })
          }
        </RadioGroup>
        <FormHelperText style={{ fontSize: 9, }}>Option auswählen</FormHelperText>
      </FormControl>
    </Box>
  );
}