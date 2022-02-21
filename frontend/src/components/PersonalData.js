import * as React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { styled } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';


const CssTextField = styled(TextField)({
  '& .MuiFormLabel-root': {
    fontSize: 12, 
  },
  '& label.Mui-focused': {
    color: '#2d2047',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#2d2047',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#2d2047',
    },
    '&:hover fieldset': {
      borderColor: '#2d2047',
    },
    '&.Mui-focused': {
      borderColor: '#2d2047',
    },
  },
});

const CssSelect = styled(Select)({
  '& legend.Mui-focused': {
    color: '#2d2047',
  },
  '& .MuiInput-underline': {
    borderColor: '#2d2047',
  },
  '&:after': {
    borderBottom: '2px solid #2d2047',
  },
  '& fieldset': {
    borderColor: '#2d2047',
  },
  '&:hover fieldset': {
    borderColor: '#2d2047',
  },
  '&.Mui-focused fieldset': {
    borderColor: '#2d2047',
  },  
});


export default function PersonalData(props) {

  const [state, setState] = React.useState(props.data) 

  const renderYears = () => {
    const list = [];
    for(let i = new Date().getFullYear(); i > new Date().getFullYear() - 130; i--) {
      list.push(<MenuItem key={`y_` + i } value={i}>{i}</MenuItem>)
    }

    return [<MenuItem disabled key={`yd`} value={`Geburtsjahr`}>Geburtsjahr</MenuItem>].concat(list);
  }

  return (
    <Box style={{ marginLeft: 0, }}>
    <FormControl style={{ marginTop: 24, }} component="fieldset">
      <FormLabel style={{ marginBottom: 8, color: '#444', fontFamily: 'DM Sans', fontSize: 14, }} component="legend">Geschlecht</FormLabel>
      <RadioGroup style={{flexWrap: 'nowrap', fontSize: 12, }} onChange={e => { setState({...state, gender: e.target.value}); props.onChange({...state, gender: e.target.value }) }} row aria-label="gender" name="row-radio-buttons-group">
        <FormControlLabel checked={state.gender === 'female' ? true : false} value="female" control={<Radio size={'small'} style={{ color: '#2d2047',}} />} label={<Typography style={{ fontFamily: 'DM Sans', fontSize: 12, }}>Weiblich</Typography>} />
        <FormControlLabel checked={state.gender === 'male' ? true : false} value="male" control={<Radio size={'small'} style={{ color: '#2d2047',}} />} label={<Typography style={{ fontFamily: 'DM Sans', fontSize: 12, }}>Männlich</Typography>} />
        <FormControlLabel checked={state.gender === 'other' ? true : false} value="other" control={<Radio size={'small'} style={{ color: '#2d2047',}} />} label={<Typography style={{ fontFamily: 'DM Sans', fontSize: 12, }}>Divers</Typography>} />
      </RadioGroup>
      <h3 style={{ fontSize: 14, fontWeight: 300, color: '#444', fontFamily:'DM Sans', marginTop: 24, padding: 0, }}>Alter</h3>
      <CssTextField
        onChange={e => { setState({...state, birthyear: e.target.value}); props.onChange({...state, birthyear: e.target.value }) }}
        style={{ width: 250, }}
        value={state.birthyear}
        label="Geburtsjahr (yyyy)"
        labelid="age-select"
        id="age-select"
      />
    </FormControl>
    <Box style={{ marginTop: 24,}}>
      <h3 style={{ fontSize: 16, fontWeight: 300, color: '#444', fontFamily:'DM Sans', marginBottom: 12, padding: 0, }}>Ort</h3>
      <Box>
          <CssTextField value={state.postcode} onChange={e => { setState({...state, postcode: e.target.value}); props.onChange({...state, postcode: e.target.value })}} style={{ marginRight: 12, width: 50,  }} id="postcode" label="PLZ" variant="standard" />
          <CssTextField value={state.city} onChange={e => { setState({...state, city: e.target.value}); props.onChange({...state, city: e.target.value })}} style={{ width: 186, }} id="city" label="Stadt / Gemeinde" variant="standard" />
      </Box>
      <Box style={{ marginTop: 24, display: 'block', }}>
        <FormControl component="fieldset" variant="standard">
          <CssTextField value={state.country} onChange={e => { setState({...state, country: e.target.value}); props.onChange({...state, country: e.target.value }) }} style={{ width: 250, }} id="country" label="Land" variant="standard" />
        </FormControl>
      </Box>
    </Box>
    </Box>
  );
}
