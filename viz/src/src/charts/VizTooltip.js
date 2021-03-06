/* eslint-disable no-mixed-operators */
export default class VizTooltip {
	/**
	 * Shows a tooltip at a given position with HTML content.
	 * @param targetRect - The bounding rect of the SVG element we are pointing the tooltip to. Has properties: x, y, width, height.
	 * @param boundaryRect - The bounding rect which the tooltip can not be displayed outside. If the tooltip gets too close to a boundary, it will try to flip to a different orientation.  Has properties: x, y, width, height.
	 * @param content - The HTML content displayed in the tooltip. Accepts an HTML string or assumes the input to be a DOM node if it's not a string.
	 * @param padding - The amount of padding we want to add to push the tooltip out further
	 * @param parent - The parent the tooltip will be attached to
	 */
	static showTooltip(targetRect, boundaryRect, content, orientation, padding, parent, id) {
		let tipDiv = parent.selectAll(`#${id}`).data([targetRect]); 

		targetRect.cx = targetRect.cx || targetRect.x + targetRect.width / 2;
		targetRect.cy = targetRect.cy || targetRect.y + targetRect.height / 2;
		targetRect.dx = targetRect.dx || targetRect.x + targetRect.width;
		targetRect.dy = targetRect.dy || targetRect.y + targetRect.height;
		boundaryRect.dx = boundaryRect.dx || boundaryRect.x + boundaryRect.width;
		boundaryRect.dy = boundaryRect.dy || boundaryRect.y + boundaryRect.height;

		let tipDivEnter = tipDiv
			.enter()
			.append('div')
			.classed('dv-tooltip', true)
			.attr('id', id)
			.style('top', 0)
			.style('left', 0);
		tipDivEnter.append('div').classed('content', true);
		tipDivEnter.append('b').classed('notch', true);

		// First clear out the content
		tipDiv.select('.content').html('');

		// Assume the content to be a DOM node if it's not a string
		if (typeof content !== 'string') {
			tipDiv
				.select('.content')
				.node()
				.appendChild(content);
		} else {
			tipDiv.select('.content').html(content);
		}

		let tipDivNotch = tipDiv.select('.notch');

		let tipNode = tipDiv.node();
		let width = Math.min(tipNode.offsetWidth, boundaryRect.width);
		let height = Math.min(tipNode.offsetHeight, boundaryRect.height);
		let top = 0;
		let left = 0;
		let clamp = function(val, min, max) {
			return Math.min(Math.max(min, val), max);
		};

		let setTopAndLeft = function(_orientation) {
			let tempLeft;
			let tempTop;
			switch (_orientation) {
				case 'left':
					tempLeft = targetRect.x - width - padding;
					tempTop = targetRect.cy - height / 2;
					break;
				case 'right':
					tempLeft = targetRect.x + targetRect.width + padding;
					tempTop = targetRect.cy - height / 2;
					break;
				case 'top':
					tempLeft = targetRect.cx - width / 2;
					tempTop = targetRect.y - height - padding;
					break;
				case 'bottom':
					tempLeft = targetRect.cx - width / 2;
					tempTop = targetRect.dy + padding;
					break;
			}

			return { left: tempLeft, top: tempTop };
		};

		let snapVertical = function() {
			if (top < boundaryRect.y) top = boundaryRect.y; // snap to the top
			if (top + height > boundaryRect.dy) top = boundaryRect.dy - height; // snap to the bottom
			tipDivNotch.style('top', clamp(targetRect.cy - top - 5, 3, height - 13) + 'px');
			tipDivNotch.style('left', null);
		};

		let snapHorizontal = function() {
			if (left < boundaryRect.x) left = boundaryRect.x; // snap to the left
			if (left + width > boundaryRect.dx) left = boundaryRect.dx - width; // snap to the right
			tipDivNotch.style('left', clamp(targetRect.cx - left - 5, 3, width - 13) + 'px');
			tipDivNotch.style('top', null);
		};

		let determineNextViableOrientation = function() {
			let dimensions;
			let invalidOrientations = [];
			let orientationPreference;

			switch (orientation) {
				case 'left':
					orientationPreference = ['left', 'right', 'top', 'bottom'];
					break;
				case 'right':
					orientationPreference = ['right', 'left', 'top', 'bottom'];
					break;
				case 'top':
					orientationPreference = ['top', 'bottom', 'left', 'right'];
					break;
				case 'bottom':
					orientationPreference = ['bottom', 'top', 'left', 'right'];
					break;
			}

			dimensions = setTopAndLeft('left');
			if (dimensions.left < boundaryRect.x) {
				invalidOrientations.push('left');
			}

			dimensions = setTopAndLeft('right');
			if (dimensions.left + width > boundaryRect.dx) {
				invalidOrientations.push('right');
			}

			dimensions = setTopAndLeft('top');
			if (dimensions.top < boundaryRect.y) {
				invalidOrientations.push('top');
			}

			dimensions = setTopAndLeft('bottom');
			if (dimensions.top + height > boundaryRect.dy) {
				invalidOrientations.push('bottom');
			}

			return orientationPreference.filter(function(el) {
				return invalidOrientations.indexOf(el) < 0;
			})[0];
		};

		// Determine where the tooltip can go
		let nextViableOrientation = determineNextViableOrientation();

		// If there is a viable orientation, use it. Otherwise, just use whatever the user defined
		if (nextViableOrientation) {
			orientation = nextViableOrientation;
		}

		// Finalize tooltip dimensions
		let dimensions = setTopAndLeft(orientation);
		left = dimensions.left;
		top = dimensions.top;

		if (orientation === 'left' || orientation === 'right') {
			snapVertical();
		} else {
			snapHorizontal();
		}

		tipDiv.classed('top right left bottom hide', false).classed(orientation, true);

		tipDivEnter.style('top', top + 'px').style('left', left + 'px');

		tipDiv.style('top', top + 'px').style('left', left + 'px'); 
	}

	static removeTooltip(parent, id) {
		parent.selectAll(`#${id}`).classed('hide', true);
  }
}
