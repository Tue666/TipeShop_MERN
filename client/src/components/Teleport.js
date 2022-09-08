import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { SpeedDial, SpeedDialAction } from '@mui/material';
import { Api, Navigation } from '@mui/icons-material';

const propTypes = {
	action: PropTypes.arrayOf(
		PropTypes.shape({
			icon: PropTypes.node,
			name: PropTypes.string,
		})
	),
};

const Teleport = ({ actions }) => {
	return (
		<StyledDial
			ariaLabel="SpeedDial openIcon"
			icon={<Api />}
			FabProps={{
				sx: {
					bgcolor: 'error.main',
					svg: {
						transform: 'rotate(0deg) scale(1)',
						transition: '0.5s',
					},
					'&:hover': {
						bgcolor: 'error.light',
					},
					'&:hover svg': {
						transform: 'rotate(360deg) scale(1.1)',
					},
				},
			}}
		>
			<SpeedDialAction
				key="Teleport to the TOP"
				icon={<Navigation />}
				tooltipTitle="Teleport to the TOP"
				onClick={() => window.scrollTo(0, 0)}
			/>
			{actions &&
				actions.map((action) => (
					<SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} />
				))}
		</StyledDial>
	);
};

const StyledDial = styled(SpeedDial)({
	position: 'fixed',
	right: '20px',
	bottom: '90px',
	transition: '0.5s',
});

Teleport.propTypes = propTypes;

export default Teleport;
