import { string } from 'prop-types';
import { styled } from '@mui/material/styles';

// components
import ToggleShowAll from '../ToggleShowAll';

const propTypes = {
	description: string,
};

const Description = ({ description }) => {
	return (
		<ToggleShowAll>
			<Content dangerouslySetInnerHTML={{ __html: description }} />
		</ToggleShowAll>
	);
};

const Content = styled('div')({
	padding: '10px',
	marginBottom: '20px',
	maxHeight: '400px',
	overflow: 'hidden',
	transition: 'all 0.5s',
});

Description.propTypes = propTypes;

export default Description;
