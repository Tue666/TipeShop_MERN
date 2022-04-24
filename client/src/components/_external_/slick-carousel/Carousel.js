import PropTypes from 'prop-types';
import Slider from 'react-slick';

const propTypes = {
	children: PropTypes.node,
	settings: PropTypes.object,
};

const Carousel = ({ children, settings }) => <Slider {...settings}>{children}</Slider>;

Carousel.propTypes = propTypes;

export default Carousel;
