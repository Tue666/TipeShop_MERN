import { styled } from '@mui/material/styles';
import { Stack, Typography, Button } from '@mui/material';
import { ThumbUpOutlined } from '@mui/icons-material';

// components
import Hidden from '../Hidden';
import Avatar from '../Avatar';
import Stars from '../Stars';
import Response from './Response';
// constant
import { PRODUCT_PAGE } from '../../constant';

const Comment = () => (
	<RootStyle direction="row">
		<Hidden width="mdDown">
			<Stack direction="column" alignItems="center" sx={{ width: PRODUCT_PAGE.COMMENT_WIDTH }}>
				<Avatar name="Lê Chính Tuệ" src="http://dotshop69.000webhostapp.com/Public/images/tue.png" />
				<Typography variant="subtitle2">Lê Chính Tuệ</Typography>
				<Typography variant="body2">Joined 4 years ago</Typography>
			</Stack>
		</Hidden>
		<Stack sx={{ width: { xs: '100%', lg: `calc(100% - ${PRODUCT_PAGE.COMMENT_WIDTH})` } }}>
			<Hidden width="mdUp">
				<Stack direction="row" alignItems="center">
					<Avatar
						name="Lê Chính Tuệ"
						src="http://dotshop69.000webhostapp.com/Public/images/tue.png"
						sx={{ width: '40px', height: '40px' }}
					/>
					<Stack sx={{ mx: 2 }}>
						<Typography variant="subtitle2">Lê Chính Tuệ</Typography>
						<Typography variant="body2">Joined 4 years ago</Typography>
					</Stack>
				</Stack>
			</Hidden>
			<Stack direction="row" alignItems="center" spacing={1}>
				<Stars total={5} rating={5} />
				<Typography variant="subtitle2">Very good</Typography>
			</Stack>
			<Typography variant="subtitle1">
				Mình đặt hàng khi em này đề giá 999k, thêm cái mã giảm được 40k. Mò mẫm em nửa ngày rút ra vài thông
				tin: Về sản phẩm: - Đầy đủ phụ kiện, bảng vẽ mới cóng không trầy xước - Nặng hơn H610 pro v2. Nếu
				H610 mỏng nhẹ và hơi cong ở hai mép thì em này mặt dưới phẳng hoàn toàn - Độ bền chưa rõ, nhưng thấy
				hoạt động ok - Cảm giác tiếp xúc giữa đầu bút và mặt bảng hơi nhám, với mình thì chấp nhận được Về
				kết nối: - Vào huion.com/download tải driver rồi cài đặt - Cắm bảng vẽ vào lap và mở driver để điều
				chỉnh các thông số (giao diện driver như hình) - Từ đây có thể kích hoạt các nút bấm, đổi chức năng
				cho nút bấm ở mục "Press keys". Ví dụ: dùng phím tắt Clrl + Z (lệnh undo) cho nút đầu tiên - Dùng
				paint tool sai ĐỪNG chọn Enable Window Ink ở mục "Digital Pen", nếu không nét sẽ thô cứng. - Chọn
				Mouse mode để xài như chuột Giao hàng: - Hộp móp góc - Hàng quốc tế có nhắc trước thời gian giao là
				tương đối, nhưng tiki vẫn nhắn tin xin lỗi hàng đến trễ 1 ngày nên ok hài lòng - Bạn shipper lịch sự
				cám ơn khách. Xin lỗi bạn shipper vì quá trông mong và mê mẩn con hàng mà quên cảm ơn lại :)))
			</Typography>
			<Typography variant="caption">Reviewed 5 months ago</Typography>
			<Stack direction="row" alignItems="center" spacing={2} my={1}>
				<Button variant="outlined" startIcon={<ThumbUpOutlined />}>
					Helpful (69)
				</Button>
				<Button variant="text">Reply</Button>
			</Stack>
			<Stack spacing={1}>
				<Response />
				<Response />
			</Stack>
		</Stack>
	</RootStyle>
);

const RootStyle = styled(Stack)(({ theme }) => ({
	padding: '20px 0',
	borderTop: `2px solid ${theme.palette.background.default}`,
}));

export default Comment;
