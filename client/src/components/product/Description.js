import { styled } from '@mui/material/styles';

// components
import ToggleShowAll from '../ToggleShowAll';

const Description = () => {
	return (
		<ToggleShowAll>
			<Content dangerouslySetInnerHTML={{ __html: '<p style="font-weight: bold;">Em đẹp lắm :))</p>' }} />
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

export default Description;
