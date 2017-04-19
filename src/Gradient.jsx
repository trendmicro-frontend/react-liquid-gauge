import PropTypes from 'prop-types';
import React from 'react';

const Gradient = (props) => {
    return (
        <defs>
            <linearGradient {...props} />
        </defs>
    );
};

Gradient.propTypes = {
    x1: PropTypes.string,
    x2: PropTypes.string,
    y1: PropTypes.string,
    y2: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.object),
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

Gradient.defaultProps = {
    x1: '0%',
    x2: '0%',
    y1: '100%',
    y2: '0%'
};

export default Gradient;
