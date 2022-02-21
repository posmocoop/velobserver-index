import React from 'react';

export default function ClassificationSlider(props) {

  const [activeClassifications, setActiveClassifications] = React.useState({
    bad: '',
    needsWork: '',
    good: '',
    great: '',
  })
  const handleClassificationChange = e => {

    const { value } = e.target;

    if(value >= 0 && value < 3) {
      setActiveClassifications({
        bad: 'active',
        input: 'bad',
      })

      props.onChange({ input: 'bad',  value: parseFloat(value) });

    } else if(value>=3 && value < 6) {
      setActiveClassifications({
        needsWork: 'active',
        input: 'needsWork',
      })

      props.onChange({ input: 'needsWork', value: parseFloat(value) });

    } else if(value >=6 && value < 9) {
      setActiveClassifications({
        good: 'active',
        input: 'good',
      })

      props.onChange({ input: 'good',  value: parseFloat(value) });

    } else if(value >= 9) {
      setActiveClassifications({
        great: 'active',
        input: 'great',
      })

      props.onChange({ input: 'great',  value: parseFloat(value) });
    }
  }

  return(
    <div className="classifiactionComponent" style={{ margin: '8px'}}>
      <div className="title">{props.title}</div>
      <div style={{ position: 'relative'}}>
        <input style={{ top: activeClassifications.input ? -10 : ''}} className={activeClassifications.input} min="0" max="11" step="0.1" type='range' onChange={(e) => { handleClassificationChange(e) }} onTouchEnd={e => { props.onDragEnd(e)} } onMouseUp={e => { props.onDragEnd(e)} } />
        <div className="classificationBarWrapper">
          <div className={`classificationBar bad ${activeClassifications.bad}`}></div>
          <div className={`classificationBar needsWork ${activeClassifications.needsWork}`}></div>
          <div className={`classificationBar good ${activeClassifications.good}`}></div>
          <div className={`classificationBar great ${activeClassifications.great}`}></div>
        </div>
      </div>
    </div>
  )
}