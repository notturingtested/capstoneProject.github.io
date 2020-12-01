/* @flow weak */
import React from 'react';
import SpectrumWait from '@react/react-spectrum/Wait';
import { _ } from './analytics/core'; 

//import './Wait.css';
//import { _ } from '@analytics/core';
/*
Example:
<Wait />
*/

const Wait = props => {
	// size: L
	// centered: true | false*
	// variant: 'overlay' // Overlays the positioned-parent with white and shows the spinner in the middle.
	// show: true*|false

	if (!(props.show ?? true)) {
		return null;
	}

	if (props.variant === 'overlay') {
		return (
			<div className="Wait--overlay">
				<SpectrumWait centered={true} {..._.omit(props, 'variant')} />
			</div>
		);
	}

	return <SpectrumWait {...props} />;
};

export default Wait;
