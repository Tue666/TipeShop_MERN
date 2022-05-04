import { useState } from 'react';
import { styled } from '@mui/material/styles';

const Collapse = ({ children }) => {
	const [isCollapsed, setIsCollapsed] = useState(true);
	return (
		<div>
			{!isCollapsed && children}
			<Text onClick={() => setIsCollapsed(!isCollapsed)}>
				{isCollapsed ? (
					<>
						View more&nbsp;
						<i className="bi bi-chevron-bar-down"></i>
					</>
				) : (
					<>
						Collapse&nbsp;
						<i className="bi bi-chevron-bar-up"></i>
					</>
				)}
			</Text>
		</div>
	);
};

const Text = styled('span')(({ theme }) => ({
	fontSize: '14px',
	display: 'flex',
	alignItems: 'center',
	paddingBlock: '5px',
	cursor: 'pointer',
	color: theme.palette.error.main,
	'&:hover': {
		color: theme.palette.error.lighter,
	},
}));

export default Collapse;
