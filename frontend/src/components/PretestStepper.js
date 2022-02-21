import * as React from 'react';
import Box from '@material-ui/core/Box';
import { useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import DescreteSlider from './DescreteSlider';
import MultipleOptions from './MultipleOptions';
import CustomRadioGroup from './CustomRadioGroup';
import PersonalData from './PersonalData';
import localStorageService from '../services/localStorageService';
import Signup from './Signup';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  dots: {
    backgroundColor: '#83b200',
  },
  dot: {
    backgroundColor: '#2d2147',
  },
  
}));

const start_title = <span>Teilnahme <br />am Pretest Panel</span>

const steps = [
  {
    label: start_title,
    body: <div style={{ fontFamily: 'DM Sans', color: '#2d2047', lineHeight: '2em', fontSize: 12, }}>
      <h2 style={{ fontSize: 16, margin: '8px 0 8px 0', padding: 0,}}>Bewertung der Zürcher Velorouten</h2>
      <p>Wir möchten <a href="https://velobserver.ch">VelObserver</a> möglichst vielen Menschen zugänglich machen.
      Dazu laden wir dich ein, uns als Tester:in zu unterstützen.</p>
      <p>Wir stellen Fragen zur:</p>
      <div>
        <ul>
          <li>Verkehrsmittelwahl</li>
          <li>Verkehrsmittelnutzung</li>
          <li>Alter, Geschlecht, Ort</li>
        </ul>
        <div>Und schliessen mit der Kontoeröffnung für die zukünftige Bewertung der Velorouten ab.
Dazu benötigen wir E-Mail und Passwort.
        </div>
      </div>
    </div>
  },
  {
    label: 'Wie bist Du unterwegs?',
    body: ({ sliderState, setSliderState, updateSlider, max, setMax }) => <div style={{ fontFamily: 'DM Sans', color: '#2d2047'}}>
      <DescreteSlider
        locked={sliderState.walking.lock}
        onLock={(lock) => {
          if(lock) {
            setMax(max - sliderState['walking'].pct)
          } else {
            setMax(max + sliderState['walking'].pct)
          }
          const newState = { ...sliderState.walking, ...{ lock : lock }};
          setSliderState({...sliderState, walking: newState });
        }}
        defaultValue={25}
        id="walking"
        max={max}
        onChange={(pct) => {
          updateSlider('walking', pct );
        }}
        name={'Zu Fuss'} />
      <DescreteSlider
        locked={sliderState.biking.lock}
        onLock={(lock) => {
          if(lock) {
            setMax(max - sliderState['biking'].pct)
          } else {
            setMax(max + sliderState['biking'].pct)
          }
          const newState = { ...sliderState.biking, ...{ lock : lock }};
          setSliderState({...sliderState, biking: newState });
        }}
        defaultValue={25}
        id="biking"
        max={max}
        onChange={(pct) => {
          updateSlider('biking', pct);
        }}
        name={'Velo'} />
      <DescreteSlider
        locked={sliderState.pt.lock}
        onLock={(lock) => {
          if(lock) {
            setMax(max - sliderState['pt'].pct)
          } else {
            setMax(max + sliderState['pt'].pct)
          }
          const newState = { ...sliderState.pt, ...{ lock : lock }};
          setSliderState({...sliderState, pt: newState });
        }}
        defaultValue={25}
        id="pt"
        max={max}
        onChange={(pct) => {
          updateSlider('pt', pct);
        }}
        name={'ÖV: Tram, Bus, Bahn'} />
      <DescreteSlider
        locked={sliderState.car.lock}
        onLock={(lock) => {
          if(lock) {
            setMax(max - sliderState['car'].pct)
          } else {
            setMax(max + sliderState['car'].pct)
          }
          const newState = { ...sliderState.car, ...{ lock : lock }};
          setSliderState({...sliderState, car: newState });
        }}
        defaultValue={25}
        id="car"
        max={max}
        onChange={(pct) => {
          updateSlider('car', pct);
        }}
        name={'MIV: Auto, Motorrad'} />
    </div>
  },
  {
    label: 'Dein Velo?',
    body: ({ bike, setBike }) => <div style={{ color: '#2d2047', fontFamily: 'DM Sans', maxHeight: window.innerHeight - 240, overflow: 'auto'}}>
      <MultipleOptions init={bike} key="bike" onChange={(bike) => { setBike(bike)}} options={
        [
          { name: `citybike`, label: `Citybike` },
          { name: `faltvelo`, label: `Faltvelo` },
          { name: `rennvelo`, label: `Rennvelo` },
          { name: `e-bike25km`, label: `E-Bike, 25 km/h` },
          { name: `e-bike45km`, label: `Schnelles E-Bike, 45 km/h` },
          { name: `mountainbike`, label: `Mountainbike` },
          { name: `e-mountainbike`, label: `E-Mountainbike` },
          { name: `gravelbike`, label: `Gravel Bike` },
          { name: `tourenbike`, label: `Tourenbike` },
          { name: 'bikesharing', label: 'Bikesharing (Publibike usw.)' },
        ]
      } />
    </div>
  },
  {
    label: 'Wann fährst Du?',
    body: ({ usage, setUsage }) => <div style={{ color: '#2d2047', fontFamily: 'DM Sans'}}>
      <MultipleOptions init={usage} key="usage" onChange={(usage) => { setUsage(usage)}} options={
        [
          { name: `arbeit`, label: `Arbeit` },
          { name: `ausbildung`, label: `Ausbildung (Schule, Universität)`},
          { name: `alltag`, label: `Alltag` },
          { name: `freizeit`, label: `Freizeit` },
          { name: `sport`, label: `Sport` },
          { name: `touren-reisen`, label: `Touren / Reisen` },
        ]
      } />
    </div>
  },
  {
    label: 'Wie oft?',
    body: ({ freq, setFreq }) => <div style={{ color: '#2d2047', fontFamily: 'DM Sans', }}>
      <CustomRadioGroup init={freq} onChange={(freq) => {setFreq(freq)}} key="freq" options={
        [
          { name: `taeglich`, label: `Täglich`, explanation: `Mehrmals pro Woche` },
          { name: `regelmeassig`, label: `Regelmässig`, explanation: `Einmal pro Woche, mehrmals pro Monat` },
          { name: `selten`, label: `Selten`, explanation: `Einmal pro Monat, mehrmals pro Jahr` },
          { name: 'nie', label: `Nie`}
        ]
      } />
    </div>
  },
  // {
  //   label: 'Strecke pro Tag?',
  //   body: <div>
  //     <CustomRadioGroup options={
  //       [
  //         { name: `l1`, label: `Unter 1 km` },
  //         { name: `f1t3`, label: `1-3 km` },
  //         { name: `f3t5`, label: `3-5 km` },
  //         { name: `f5t10`, label: `5-10 km` },
  //         { name: `f10to15`, label: `10-15 km` },
  //         { name: `m15`, label: `Über 15 km` },
  //       ]
  //     } />
  //   </div>
  // },
  {
    label: 'Geschlecht, Alter, Ort',
    body: ({ personalData, setPersonalData, user }) => <div style={{ color: '#2d2047', fontFamily: 'DM Sans'}}>
      <PersonalData data={personalData} onChange={data => { setPersonalData(data)}} />
    </div>
  },
  {
    label: 'Konto erstellen*',
    body: ({ signupData, setSignupData}) => <div style={{ color: '#2d2047', fontFamily: 'DM Sans'}}>
      <Signup data={signupData} onChange={data => setSignupData(data)} />
    </div>
  },
];

export default function PretestStepper() {
  const theme = useTheme();
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = steps.length;

  const [finished, setFinished] = React.useState(localStorageService.getUserPretestPanel() ? true : false);
  const [error, setError] = React.useState(false);
  const [user, setUser] = React.useState(localStorageService.getUser())

  React.useEffect(async () => {

    // get data from datamap about the user if user has a token
    if(user) {

      try {
        const dmUser = await axios.get(`${process.env.REACT_APP_ID_SERVER}/api/user/data`, {
          headers: {
            Authorization: user.jwt
          }
        })
  
        const { data } = dmUser.data;

        setUser(data);
        setPersonalData({
          birthyear: data.birthyear,
          gender: data.gender === 0 ? 'male' : data.gender === 1 ? 'female' : data.gender === 2 ? 'Other' : false,
          city: data.city,
          country: data.country,
          postcode: data.postcode,
        });
        setSignupData({
          email: data.email,
        })
      } catch(err) {

      }

    }
  }, [])

  const [sliderState, setSliderState] = React.useState({
    walking: { pct: 25, lock: false, id: 'walking' },
    biking: { pct: 25, lock: false, id: 'biking' },
    pt: { pct: 25, lock: false, id: 'pt', },
    car: { pct: 25, lock: false, id: 'car' }
  })

  const [max, setMax] = React.useState(100);

  const [bike, setBike ] = React.useState({});
  const [usage, setUsage ] = React.useState({});
  const [freq, setFreq ] = React.useState({});
  const [personalData, setPersonalData ] = React.useState({
    birthyear: '',
    postcode: '',
    city: '',
    country: '',
    gender: false,
  });
  const [signupData, setSignupData] = React.useState({
    email: '',
    password: '',
  })

  const isNextDisabled = (activeStep) => {
    switch(activeStep) {
      case 0:
        return false;
      case 1:
        return false;
      case 2:
        return false;
      case 3:
        return false;
      case 4:
        for(let o in freq) {
          if(freq[o]) {
            return false;
          }
        }
        return true;
      case 5:
        for(let o in personalData) {
          if(!!personalData[o] === false) {
            return true;
          }
        }
        return false;
      case 6:
        if(!!signupData.email === false || !!signupData.password === false) {
          return true;
        }
        if(signupData.password.length < 5) { return true; }

        return false;
      default:
        return true;

    }
  }

  const updateSlider = (id, pct) => {

    const ids = ['walking', 'biking', 'pt', 'car'];

    const targets = ids.filter(origin => { return origin !== id && sliderState[origin].lock === false });
    const toDistribute = pct - sliderState[id].pct ;

    let next = 0;
    if(Math.abs(toDistribute / targets.length) >= 0) {

      targets.forEach((target, i) => {

        if(i === 0 && toDistribute % targets.length !== 0) {
          sliderState[target].pct -=  toDistribute % targets.length;
        }

        if(sliderState[target].pct - parseInt(toDistribute / targets.length) < 0) {
          next += sliderState[target].pct - parseInt(toDistribute / targets.length);
          sliderState[target].pct = 0;
        } else {
          sliderState[target].pct -= parseInt(toDistribute / targets.length);
        }

        document.querySelector(`#${target} .MuiSlider-thumb`).style.left= sliderState[target].pct + '%';
        document.querySelector(`#${target} .MuiSlider-thumb span span span`).innerHTML = sliderState[target].pct;

        document.querySelector(`#${target} .MuiSlider-track`).style.width = sliderState[target].pct + '%';
        document.querySelectorAll(`#${target} .MuiSlider-markLabel`).forEach(item => { if(parseInt(item.style.left) > sliderState[target].pct) { item.classList.remove('MuiSlider-markLabelActive') } })

      })

      if(Math.abs(next) > 0) {
        for(let i = 0; i < targets.length; i++) {
          const target = targets[i];
          if(sliderState[target].pct + next >= 0) {

            sliderState[target].pct += next;

            document.querySelector(`#${target} .MuiSlider-thumb`).style.left= sliderState[target].pct + '%';
            document.querySelector(`#${target} .MuiSlider-track`).style.width = sliderState[target].pct + '%';
            document.querySelectorAll(`#${target} .MuiSlider-markLabel`).forEach(item => { if(parseInt(item.style.left) > sliderState[target].pct) { item.classList.remove('MuiSlider-markLabelActive') } })
            break;
          }
        }
      }
    }

    sliderState[id].pct = pct;
    setSliderState({...sliderState});

  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setError(false);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = () => {

      if(user) {
  
         const data = {
           bike_type: bike,
           bike_usage: usage,
           bike_frequency: freq,
           transport_mode: {
             fussgaenger_pct: sliderState['walking'].pct,
             velo_pct: sliderState['biking'].pct,
             oev_pct: sliderState['pt'].pct,
             miv_pct: sliderState['car'].pct,
           },
           user: {
             ...signupData,
             ...personalData,
             id: user.id,
           }
         }
         // store pretest data to localstorage
         localStorageService.setUserPretestPanel(data);
 
         // update datamap account
         return axios.post(`${process.env.REACT_APP_ID_SERVER}/api/user/update`, {...data.user, gender: data.user.gender === 'male' ? 0 : data.user.gender === 'female' ? 1 : 2}, {
           headers: {
             Authentication: localStorageService.getUser().jwt,
           }
         })
         .then(() => {
         // do another call to store data mapping id to email on posmo coop server
           return axios.post(`${process.env.REACT_APP_API}/v1/addPersona`, data);
         })
         .then(() => {
           setError(false);
           setFinished(true);

           // redirect to bike index.
           window.location.href="/";
         })
         .catch(err => {
          console.log(err);
          setError(<Typography style={{ color: 'red'}}>Error!</Typography>)
        });
      } else {

        // for new users
        axios.post(`${process.env.REACT_APP_ID_SERVER}/api/user/register`, {
          email: signupData.email,
          password: signupData.password,
        }, {
          headers: {
            'Client-Api-Key': process.env.REACT_APP_CLIENT_API_KEY
          }
        })
        .then(registration => registration.data)
        .then(registration => {
  
          // store user data
          localStorageService.setUser(registration.data);
  
          const data = {
            bike_type: bike,
            bike_usage: usage,
            bike_frequency: freq,
            transport_mode: {
              fussgaenger_pct: sliderState['walking'].pct,
              velo_pct: sliderState['biking'].pct,
              oev_pct: sliderState['pt'].pct,
              miv_pct: sliderState['car'].pct,
            },
            user: {
              ...signupData,
              ...personalData,
              id: registration.data.id,
            }
          }
          // store pretest data to localstorage
          localStorageService.setUserPretestPanel(data);
  
          // update datamap account
          return axios.post(`${process.env.REACT_APP_ID_SERVER}/api/user/update`, {...data.user, gender: data.user.gender === 'male' ? 0 : data.user.gender === 'female' ? 1 : 2}, {
            headers: {
              Authentication: registration.data.jwt
            }
          })
          .then(() => {
          // do another call to store data mapping id to email on posmo coop server
            return axios.post(`${process.env.REACT_APP_API}/v1/addPersona`, data);
          })
  
        })
        .then(persona => persona.data)
        .then(persona => {
  
          setError(false);
          setFinished(true);
        })
        .catch(err => {
          console.log(err);
          setError(<Typography style={{ color: 'red'}}>Error!</Typography>)
        })
      }

    
  }

  return (
    <Box style={{ maxWidth: 290, margin: '0 auto', }}>
      <div style={{ textAlign: 'left', padding: '16px 0 0 0'}}>
        <img style={{ maxWidth: 120, }} alt="velobserver-logo (bicycle)" src="./assets/logo.svg" />
      </div>
      <Box style={{ margin: '0 auto', maxWidth: 290, }}>
      <Paper
        square
        elevation={0}
        style={{ padding: '12px 0 0 0', backgroundColor: '#f8f7f5' }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 50,
          pl: 2,
        }}
      >
        <Typography style={{ color: '#83b200', fontFamily: 'Recoleta',fontSize: 24, fontWeight: 600, padding: 0, }}>{finished ? 'Besten Dank für deine Anmeldung!' : steps[activeStep].label}</Typography>
      </Paper>
      <Box>
        {
          error ? error : ''
        }
        {
          !finished ? 
          typeof steps[activeStep].body === 'function' ?
          steps[activeStep].body({ sliderState, setSliderState, updateSlider, max, setMax, bike, setBike, usage, setUsage, freq, setFreq, personalData, setPersonalData, signupData, setSignupData, user })
          :
          steps[activeStep].body
          : <div>
            <p style={{ fontSize: 12, }}>
            Wir werden dich benachrichtigen, sobald du die ersten <a href="https://velobserver.ch">Velorouten</a> bewerten kannst.
            </p>
          </div>
        }
      {
        activeStep === 0 && !finished ? <div style={{ textAlign: 'center', margin: 12, padding: 0,}}><Button style={{ position: 'fixed', bottom: 12, fontWeight: 600, fontFamily: 'Recoleta',color: '#eee', backgroundColor: '#83b200', fontSize: 14, textTransform: 'none'}} onClick={handleNext} variant="contained">Fragebogen starten</Button></div> : ''
      }
      </Box>
      </Box>
      {
        !finished && activeStep > 0 ?
       <MobileStepper
        style={{ maxWidth: 290, margin: '0 auto', borderRadius: 8, }}
        variant="dots"
        classes={{ root: classes.dots, dotActive: classes.dot }}
        steps={maxSteps}
        // position="static"
        activeStep={activeStep}
        nextButton={            
          (activeStep === maxSteps - 1) || (activeStep === maxSteps - 2 && user) ?
               <Button id="finished" disabled={isNextDisabled(activeStep)} style={{ fontWeight: 600, fontSize: 14, fontFamily: 'Recoleta', textTransform: 'none', }} size="small" onClick={handleFinish}>Fertig stellen</Button> : <Button style={{ fontWeight: 600, fontSize: 14, textTransform: 'none', fontFamily: 'Recoleta'}} key={`step${activeStep}`} disabled={isNextDisabled(activeStep)} size="small" onClick={handleNext}>Weiter <KeyboardArrowRight /></Button>
        }
        backButton={
          <Button style={{ fontWeight: 600, fontFamily: 'Recoleta', fontSize: 14, textTransform: 'none', }} size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight/>
            ) : (
              <KeyboardArrowLeft />
            )}
            Zurück
          </Button>
        }
      /> : ''
      }
    </Box>
  );
}
