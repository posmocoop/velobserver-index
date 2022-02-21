import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TuneIcon from '@material-ui/icons/TuneRounded';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBikeRounded';
import PersonIcon from '@material-ui/icons/PersonRounded';
import RemoveRoundedIcon from '@material-ui/icons/RemoveRounded';
import Button from '@material-ui/core/Button';
import ClassificationSlider from './ClassificationSlider';
import Icon from './Icon'
import { useHistory } from "react-router-dom";
import cx from 'classnames';
import './MainMenu.css'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function MainMenu(props) {
  const classes = useStyles();
  let history = useHistory();

  const [drawerTouch, setDrawerTouch] = React.useState(null);
  const [drawerHeight, setDrawerHeight] = React.useState(props?.active?.title === 'classify' ? 96 : 18);
  const [popupData, setPopupData] = React.useState(null);
  const [currentClassification, setCurrentClassification] = React.useState({
    safety: 6.0,
    conflict: 6.0,
    attractiveness: 6.0,
  })
  const [pristine, setPristine] = React.useState(true);
	const [submitting, setSubmitting] = React.useState(false)
  const [classification, setClassification] = useState(0)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const classification = urlParams.get('criterion')
    setClassification(classification)
}, [])

  const handleDrawerHeight = (e) => {
    if(drawerTouch != null) {

      if(e.clientY - drawerTouch.clientY > 20) {
        setDrawerHeight(18);
        props.setGeoLocateStyle({
          right: 6,
          top: 20,
          position: 'fixed',
        })
      }

      if(e.clientY - drawerTouch.clientY < -20) {

        if(!props?.data?.features?.length) {
          setDrawerHeight(96);
          const bottom = window.innerWidth > 440 ? 55 : 100
          props.setGeoLocateStyle({
            right: 6,
            top: 20,
            position: 'fixed',
          })
        } else {
          setDrawerHeight(200);
          props.setGeoLocateStyle({
            right: 6,
            top: 20,
            position: 'fixed',
          })
        }
      }
    }
  }

  React.useEffect(() => {

    if(!props?.data?.features?.length) {
      // change title menu context.
      setPristine(true);
      if(drawerHeight !== 18) {
        setDrawerHeight(96);
        const bottom = window.innerWidth > 440 ? 55 : 100
        props.setGeoLocateStyle({
          right: 6,
          top: 20,
          position: 'fixed',
        })
      }
    } else {
      // change title to slider options.
      if(drawerHeight !== 18) {
        setDrawerHeight(200);
        props.setGeoLocateStyle({
          right: 6,
          top: 20,
          position: 'fixed',
        })
      }
    }
  }, [props.data]);

  const createExplanation = (type , e) => {

    switch(type) {
      case 'safety':
        switch(e.input) {
          case 'bad':
            return { type: 'ungenügend', color: `#ec6d6e`, title: `sicherheit`, text: `z.B. viel motorisierter Verkehr ohne Abtrennung, Gefahr durch Parkplätze am Strassenrand`}
          case 'needsWork':
            return { type: 'knapp vorbei', color: `#f3b442`, title: `sicherheit`, text: `z.B. abgetrennt vom motorisierten Verkehr durch einen Velostreifen`}
          case 'good':
            return { type: 'gut', color: `#96b63c`, title: `sicherheit`, text: `z.B. abgetrennt vom motorisierten Verkehr durch Poller`}
          case 'great':
            return { type: 'hervorragend', color: `#59864e`, title: `sicherheit`, text: `z.B. baulich abgesetzt vom motorisierten Verkehr und der Fussverkehrsfläche`}
          default:
            return;
        }
      case 'conflict':
        switch(e.input) {
          case 'bad':
            return { type: 'ungenügend', color: `#ec6d6e`, title: `konfliktfreiheit`, text: `z.B. gemischt mit viel motorisiertem Verkehr (eventuell auch ÖV oder Schwerverkehr)`}
          case 'needsWork':
            return { type: 'knapp vorbei', color: `#f3b442`, title: `konfliktfreiheit`, text: `z.B. gemischt mit moderatem motorisiertem Verkehr oder sehr viel Fussverkehr`}
          case 'good':
            return { type: 'gut', color: `#96b63c`, title: `konfliktfreiheit`, text: `z.B. wenig motorisierter Verkehr, selten Parkplätze/Umschlagflächen am Strassenrand oder gemischt mit wenig Fussverkehr`}
          case 'great':
            return { type: 'hervorragend', color: `#59864e`, title: `konfliktfreiheit`, text: `z.B. kein Mischverkehr, keine Parkplätze`}
          default:
            return;
        }
      case 'attractiveness':
        switch(e.input) {
          case 'bad':
            return { type: 'ungenügend', color: `#ec6d6e`, title: `attraktivität`, text: `z.B. keine oder sehr schmale Velospur`}
          case 'needsWork':
            return { type: 'knapp vorbei', color: `#f3b442`, title: `attraktivität`, text: `z.B. nur hintereinander fahren möglich, enge Platzverhältnisse`}
          case 'good':
            return { type: 'gut', color: `#96b63c`, title: `attraktivität`, text: `z.B. Überholen und nebeneinander fahren einigermassen möglich, angenehme Umgebung`}
          case 'great':
            return { type: 'hervorragend', color: `#59864e`, title: `attraktivität`, text: `z.B. Überholen und nebeneinander fahren problemlos möglich, attraktive Umgebung`}
          default:
            return;
        }
    }
  }

  const handleClassify = () => {
    props.onClassify(currentClassification);
    setCurrentClassification({
      safety: 5.5,
      conflict: 5.5,
      attractiveness: 5.5,
    })
  }

  const handleClassificationChange = (type, e) => {
    setPopupData(createExplanation(type, e));

    setPristine(false);

    setCurrentClassification({
      ...currentClassification,
      [type]: e.value
    })

    props.onClassificationChange({
      ...currentClassification,
      [type]: e.value
    });
  }

  const closePopup = () => {
    setPopupData(null);
  }

  const onBikeClicked = () => {
    history.push("/");
  }

  const onVotingClicked = () => {
    history.push("/general-rating");
  }

  const onMenuClicked = () => {
    history.push("/menu");
  }

  const renderClassificationSliders = () => {

    return(
      <div>
        <ClassificationSlider title="Sicherheit" onDragEnd={e => closePopup()} onChange={e => handleClassificationChange('safety', e)} />
        <ClassificationSlider title="Konfliktfreiheit" onDragEnd={e => closePopup()} onChange={e => handleClassificationChange('conflict', e)} />
        <ClassificationSlider title="Attraktivität" onDragEnd={e => closePopup()} onChange={e => handleClassificationChange('attractiveness', e)} />
      </div>
    )
  }

  const renderClassificationActions = () => {

    return(
      <div style={{ margin: '24px auto 12px auto', position: 'relative', }}>
        <div style={{ fontSize: 12, }}>
          <div style={{ position: 'relative', height: 30, }}>
            <div>
              <span style={{ marginLeft: 18, color: '#5FABE3', fontWeight: 600, }}>{props?.data?.features?.length} Segment{props?.data?.features.length > 1 ? 'e ' : ' '}</span>
              <span>ausgewählt.</span>
            </div>
            <div style={{ position: 'absolute', right: 18, top: -6, }}>
              { !pristine ? <Button onClick={() => handleClassify() } style={{ backgroundColor: '#5FABE3', color: '#f7f7f7', textTransform: 'none', borderRadius: 8, fontSize: 12, width: 80, padding: '4px 8px', }}>Speichern</Button> : ''}
            </div>
          </div>
          <div>
            { renderClassificationSliders() }
          </div>
          <div style={{ position: 'relative'}}>
            <div style={{ fontFamily: 'DM Sans', fontSize: 10, textTransform: 'uppercase', color: '#A9B3B7', position: 'absolute', left: 10, top: 2, }}>Ungenügend</div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 10, textTransform: 'uppercase', color: '#A9B3B7', position: 'absolute', right: 10, top: 2, }}>Hervorragend</div>
          </div>
        </div>
      </div>
    )
  }

  const onNewVote = async (mark) => {
    if (props.onNewVote) {
      setSubmitting(true)
      await props.onNewVote(mark)
      setSubmitting(false)
    }
  }

  const renderNewVotingAction = () => {
    let badVoteLabel = ''
    let bestVoteLabel = ''
    let title = 'Wie bewertest du diese Strecke als Velofahrer:in?'
    if (classification === 'safety') {
      badVoteLabel = 'Unsicher'
      bestVoteLabel = 'Sicher'
      title = 'Fühlst du dich als Velofahrer:in sicher auf dieser Strecke?'
    }

    if (classification === 'conflict') {
      badVoteLabel = 'Viele Konflikte'
      bestVoteLabel = 'Keine Konflikte'
      title = 'Kannst du hier ungestört und ohne andere zu stören durchfahren?'
    }

    if (classification === 'attractiveness') {
      badVoteLabel = 'Unattraktiv'
      bestVoteLabel = 'Attraktiv'
      title = 'Findest du diese Strecke attraktiv?'
    }

    return(
      <div style={{ margin: '24px auto 12px auto', position: 'relative', }}>
        <div style={{ fontSize: 12, }}>
          <div style={{ position: 'relative', height: 30, }}>
            <div>
              <span style={{ marginLeft: 18, color: '#5FABE3', fontWeight: 600, }}>{props?.data?.features?.length} Segment{props?.data?.features.length > 1 ? 'e ' : ' '}</span>
              <span>ausgewählt.</span>
            </div>
          </div>
          <div className='GlobalVotingMap'>
            <p className='GlobalVotingMap__paragraph'>
              {title}
            </p>
            {!submitting && (
              <>
                <div className='GlobalVotingMap__votes'>
                  <div onClick={onNewVote.bind(null, 1)}>
                    <Icon name='rating_1' />
                  </div>
                  <div onClick={onNewVote.bind(null, 2)}>
                    <Icon name='rating_2' />
                  </div>
                  <div onClick={onNewVote.bind(null, 3)}>
                    <Icon name='rating_3' />
                  </div>
                  <div onClick={onNewVote.bind(null, 4)}>
                    <Icon name='rating_4' />
                  </div>
                </div>
              </>
            )}
            {submitting && (
              <div className='GlobalVotingMap__voteSubmitting'>Submitting...</div>
            )}
            <div className='GlobalVotingMap__description'>
              <div className='GlobalVotingMap__description--bad'>{badVoteLabel}</div>
              <div className='GlobalVotingMap__description--good'>{bestVoteLabel}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const path = history?.location?.pathname || '/'
  const isVoting = path === '/general-rating' || path === '/general-rating-photos' || path === '/general-rating-map' || path === '/classification-rating' || path === '/classification-rating-photos' || path === '/classification-rating-map'
  const isMenu = path === '/menu'

  const bikeCSS = cx('mainMenu--icon-apply-space MenuIcon', { 'MenuIcon--active': path === '/'})
  const bikeColor = path === '/' ? '#5FABE3' : '#707070'

  const bewertenCSS = cx('mainMenu--icon-apply-space MenuIcon', { 'MenuIcon--active': isVoting})
  const bewertenColor = isVoting ? '#5FABE3' : '#707070'

  const menuCSS = cx('mainMenu--icon-apply-space MenuIcon', { 'MenuIcon--active': isMenu})
  const menuColor = isMenu ? '#5FABE3' : '#707070'
  
  const activeTitle = props?.active?.title
  const featuresLength = props?.data?.features?.length
  const hidePopup = path === '/'

  const showDescription = activeTitle === 'classify' && !featuresLength && !hidePopup
  const showOldAction = activeTitle === 'classify' && !!featuresLength && !props.simpleVote && !hidePopup
  const showNewAction = activeTitle === 'classify' && !!featuresLength && props.simpleVote && !hidePopup

  const mmPopupHeight = hidePopup ? 18 : drawerHeight

  const showDrawer = path === '/general-rating-map' || path === '/classification-rating-map'

  return(
    <div>
      <div className="mm-popup" style={{ visibility: popupData ? 'visible' : 'hidden', zIndex: popupData ? 1001 : -1 }}>
        <div className="title">{popupData && popupData.title}</div>
        <div className="classTag">
          <div style={{ marginRight: 12, width: 15, height: 15, borderRadius: '50%', backgroundColor: popupData && popupData.color }}></div><div>{popupData && popupData.type}</div>
        </div>
        <div className="classText">
          {popupData && popupData.text}
        </div>
      </div>
      {showDrawer && (
        <div className="mm--drawer" style={{ height: showNewAction ? mmPopupHeight + 30 : mmPopupHeight }}>
          <div onTouchStartCapture={e => setDrawerTouch(e.changedTouches[0])} onTouchEndCapture={(e) => { handleDrawerHeight(e.changedTouches[0]) }} style={{ position: 'absolute', top: -10, left: 'calc(50% - 14px)' }}><RemoveRoundedIcon style={{ fontSize: 36, color: '#b2b2b2'}}/></div>
          <div style={{ display: 'flex' }}>
            {showDescription && (
              <div style={{ margin: '0 auto'}}>
                <h3 style={{ fontSize: 14, }}>Veloroutennetz bewerten</h3>
                <p style={{ fontSize: 12, lineHeight: 1.4, }}>Wähle durch Klicken einen oder mehrere<br /> Abschnitte aus, um sie zu bewerten.</p>
              </div>
            )}
            {showOldAction && (
              renderClassificationActions()
            )}
            {showNewAction && (
              renderNewVotingAction()
            )}
          </div>
        </div>
      )}
      <div className="mainMenu">
        <div className="mainMenu--icon-wrap">
          <div className={bikeCSS} onClick={onBikeClicked}>
            <div>
              <DirectionsBikeIcon style={{ color: {bikeColor}, fontSize: 26, }} />
            </div>
            <div>Routen</div>
          </div>
          <div className={bewertenCSS} onClick={onVotingClicked}>
            <div>
              <Icon name='bewerten' fill={bewertenColor} />
            </div>
            <div>Bewerten</div>
          </div>
          <div className={menuCSS} onClick={onMenuClicked}>
            <div style={{minHeight: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Icon name='more' fill={menuColor} />
            </div>
            <div>Mehr</div>
          </div>
        </div>
      </div>
    </div>
  )
}