import { shape, string, arrayOf, number } from 'prop-types';
import { Font, Document, Page, View, Image, Text, Link, StyleSheet } from '@react-pdf/renderer';

// pages
import { states } from '../../pages/customer/Orders';
// routes
import { PATH_MAIN } from '../../routes/path';
// utils
import { toVND } from '../../utils/formatMoney';
import { fDate } from '../../utils/formatDate';

const common = {
	seller: {
		name: 'TIPE TRADE COMPANY',
		address: 'Topaz City, ward 4, district 8, Ho Chi Minh city',
		phoneNumber: '0586181641',
	},
	borderColor: '#000000',
	tableColumns: [
		{
			title: '',
			space: '5%',
			note: '1',
		},
		{
			title: 'Product',
			space: '35%',
			note: '2',
		},
		{
			title: 'Price',
			space: '18%',
			note: '3',
		},
		{
			title: 'Qty',
			space: '6%',
			note: '4',
		},
		{
			title: 'Discount',
			space: '18%',
			note: '5',
		},
		{
			title: 'Guess',
			space: '18%',
			note: '6=3x4-5',
		},
	],
};

Font.register({
	family: 'Quicksand',
	src: 'http://fonts.gstatic.com/s/quicksand/v6/sKd0EMYPAh5PYCRKSryvW6CWcynf_cDxXwCLxiixG1c.ttf',
});

const styles = StyleSheet.create({
	page: {
		padding: '50px',
		fontFamily: 'Quicksand',
		position: 'relative',
	},
	spacing: {
		margin: '15px',
	},
	logo: {
		width: '150px',
		height: '150px',
	},
	horizontalView: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	largeText: {
		fontSize: '55px',
	},
	mediumText: {
		fontSize: '30px',
	},
	smallText: {
		fontSize: '22px',
	},
	tableContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		border: `1px solid ${common.borderColor}`,
		fontSize: '30px',
		textAlign: 'center',
	},
	tableRow: {
		flexDirection: 'row',
		alignItems: 'center',
		borderBottom: `1px solid ${common.borderColor}`,
		padding: '20px 0',
	},
	tableCell: {
		borderRight: `1px solid ${common.borderColor}`,
		padding: '0 30px',
	},
	cellCurrency: {
		textAlign: 'right',
	},
	stamp: {
		position: 'absolute',
		top: '50%',
		left: '65%',
		zIndex: 999,
		alignItems: 'center',
		padding: '50px 100px',
		border: '2px solid #00AB55',
		transform: 'rotate(40deg)',
		color: '#00AB55',
		fontSize: '100px',
		textTransform: 'uppercase',
	},
	signature: {
		padding: '20px 40px',
		border: '2px solid #00AB55',
		color: '#00AB55',
		margin: '20px',
	},
});

const Header = ({ invoiceCreatedAt }) => {
	return (
		<View style={{ ...styles.horizontalView, marginBottom: '130px' }}>
			<View style={{ flex: '1 1 0%', alignItems: 'center' }}>
				<Image src="/logo.png" style={styles.logo} />
			</View>
			<View style={{ flex: '4 1 0%', alignItems: 'center' }}>
				<View style={{ alignItems: 'center' }}>
					<Text style={{ ...styles.largeText, color: 'red' }}>Value-Added Tax Invoice</Text>
					<Text style={{ ...styles.mediumText }}>{fDate(invoiceCreatedAt)}</Text>
					<Text style={{ ...styles.mediumText }}>(Representation of an electronic invoice)</Text>
				</View>
			</View>
			<View style={{ flex: '1 1 0%', alignItems: 'center' }} />
		</View>
	);
};

const SellerInfor = () => {
	return (
		<View>
			<View style={{ ...styles.horizontalView, marginBottom: '20px' }}>
				<Text style={{ ...styles.mediumText, width: '300px' }}>Seller</Text>
				<Text> : </Text>
				<Text style={{ ...styles.mediumText, textTransform: 'uppercase' }}>{common.seller.name}</Text>
			</View>
			<View style={{ ...styles.horizontalView, marginBottom: '20px' }}>
				<Text style={{ ...styles.mediumText, width: '300px' }}>Address</Text>
				<Text> : </Text>
				<Text style={{ ...styles.mediumText }}>{common.seller.address}</Text>
			</View>
			<View style={{ ...styles.horizontalView, marginBottom: '20px' }}>
				<Text style={{ ...styles.mediumText, width: '300px' }}>Phone number</Text>
				<Text> : </Text>
				<Text style={{ ...styles.mediumText }}>{common.seller.phoneNumber}</Text>
			</View>
		</View>
	);
};

const BuyerInfor = ({ shippingAddress, paymentMethod }) => {
	const { name, street, ward, district, region, phone_number } = shippingAddress;
	const { method_text } = paymentMethod;
	return (
		<View style={{ border: `1px solid ${common.borderColor}`, padding: '30px' }}>
			<View style={{ ...styles.horizontalView, marginBottom: '20px' }}>
				<Text style={{ ...styles.mediumText, width: '300px' }}>Buyer</Text>
				<Text> : </Text>
				<Text style={{ ...styles.mediumText }}>{name}</Text>
			</View>
			<View style={{ ...styles.horizontalView, marginBottom: '20px' }}>
				<Text style={{ ...styles.mediumText, width: '300px' }}>Address</Text>
				<Text> : </Text>
				<Text style={{ ...styles.mediumText }}>
					{street}, {ward}, {district}, {region}
				</Text>
			</View>
			<View style={{ ...styles.horizontalView, marginBottom: '20px' }}>
				<Text style={{ ...styles.mediumText, width: '300px' }}>Phone number</Text>
				<Text> : </Text>
				<Text style={{ ...styles.mediumText }}>{phone_number}</Text>
			</View>
			<View style={{ ...styles.horizontalView, marginBottom: '20px' }}>
				<Text style={{ ...styles.mediumText, width: '300px' }}>Payment method</Text>
				<Text> : </Text>
				<Text style={{ ...styles.mediumText }}>{method_text}</Text>
			</View>
		</View>
	);
};

const InvoiceTable = ({ invoice }) => {
	const totalDiscount = invoice.reduce((sum, item) => {
		const { original_price, price, quantity } = item;
		return sum + (original_price - price) * quantity;
	}, 0);
	const totalGuess = invoice.reduce((sum, item) => {
		const { price, quantity } = item;
		return sum + price * quantity;
	}, 0);
	return (
		<View style={{ ...styles.tableContainer }}>
			{/* Title */}
			<View style={{ ...styles.tableRow }}>
				{common.tableColumns.map((column, index) => {
					const { title, space } = column;
					return (
						<Text key={index} style={{ ...styles.tableCell, width: space }}>
							{title}
						</Text>
					);
				})}
			</View>
			<View style={{ ...styles.tableRow }}>
				{common.tableColumns.map((column, index) => {
					const { note, space } = column;
					return (
						<Text key={index} style={{ ...styles.tableCell, width: space }}>
							{note}
						</Text>
					);
				})}
			</View>
			{/* Invoice */}
			{invoice.map((item, index) => {
				const { _id, name, original_price, price, quantity } = item;
				return (
					<View key={_id} style={{ ...styles.tableRow }}>
						<Text style={{ ...styles.tableCell, width: common.tableColumns[0].space }}>{index + 1}</Text>
						<Text style={{ ...styles.tableCell, width: common.tableColumns[1].space }}>{name}</Text>
						<Text style={{ ...styles.tableCell, ...styles.cellCurrency, width: common.tableColumns[2].space }}>
							{toVND(original_price)}
						</Text>
						<Text style={{ ...styles.tableCell, width: common.tableColumns[3].space }}>{quantity}</Text>
						<Text style={{ ...styles.tableCell, ...styles.cellCurrency, width: common.tableColumns[4].space }}>
							{toVND((original_price - price) * quantity)}
						</Text>
						<Text style={{ ...styles.tableCell, ...styles.cellCurrency, width: common.tableColumns[5].space }}>
							{toVND(price * quantity)}
						</Text>
					</View>
				);
			})}
			{/* Summary */}
			<View style={{ ...styles.tableRow }}>
				<Text
					style={{
						...styles.tableCell,
						width: `${
							parseInt(common.tableColumns[0].space.slice(0, -1)) +
							parseInt(common.tableColumns[1].space.slice(0, -1)) +
							parseInt(common.tableColumns[2].space.slice(0, -1)) +
							parseInt(common.tableColumns[3].space.slice(0, -1))
						}%`,
					}}
				>
					Total
				</Text>
				<Text style={{ ...styles.tableCell, ...styles.cellCurrency, width: common.tableColumns[4].space }}>
					{toVND(totalDiscount)}
				</Text>
				<Text style={{ ...styles.tableCell, ...styles.cellCurrency, width: common.tableColumns[5].space }}>
					{toVND(totalGuess)}
				</Text>
			</View>
		</View>
	);
};

const Signature = ({ trackingInfor }) => {
	const { status, time } = trackingInfor;
	return (
		<View
			style={{ ...styles.horizontalView, justifyContent: 'space-around', alignItems: 'flex-start' }}
		>
			<View style={{ alignItems: 'center' }}>
				<Text style={{ ...styles.mediumText }}>Buyer</Text>
				<Text style={{ ...styles.smallText }}>(Sign, write full name)</Text>
			</View>
			<View style={{ alignItems: 'center' }}>
				<Text style={{ ...styles.mediumText }}>Seller</Text>
				<Text style={{ ...styles.smallText }}>(Sign, write full name)</Text>
				{status === states.delivered && (
					<View style={{ ...styles.signature }}>
						<Text style={{ ...styles.mediumText }}>Signed by {common.seller.name}</Text>
						<Text style={{ ...styles.smallText }}>Signed date: {fDate(time)}</Text>
					</View>
				)}
			</View>
		</View>
	);
};

const Footer = ({ lookupCode }) => {
	return (
		<View style={{ alignItems: 'center', marginTop: '100px' }}>
			<Text style={{ ...styles.mediumText }}>
				Look up electronic invoices at{' '}
				<Link src={`${window.location.origin}${PATH_MAIN.invoiceLookup}`}>here</Link>, lookup code:{' '}
				{lookupCode}
			</Text>
			<Text style={{ ...styles.smallText }}>
				(Need to check and compare when making, delivering and receiving invoices)
			</Text>
		</View>
	);
};

const Stamp = () => {
	return (
		<View style={{ ...styles.stamp }}>
			<Text>PAID</Text>
		</View>
	);
};

const propTypes = {
	order: shape({
		_id: string,
		shipping_address: shape({
			name: string,
			street: string,
			ward: string,
			district: string,
			region: string,
			phone_number: string,
		}),
		payment_method: shape({
			method_text: string,
		}),
		items: arrayOf(
			shape({
				_id: string,
				name: string,
				original_price: number,
				price: number,
				quantity: number,
			})
		),
		tracking_infor: shape({
			status: string,
			time: string,
		}),
		updatedAt: string,
	}),
};

const Invoice = ({ order }) => {
	const { _id, shipping_address, payment_method, items, tracking_infor, createdAt } = order;
	return (
		<Document language="vn">
			<Page size="A1" style={styles.page}>
				<Header invoiceCreatedAt={createdAt} />
				<SellerInfor />
				<View style={styles.spacing} />
				<BuyerInfor shippingAddress={shipping_address} paymentMethod={payment_method} />
				<View style={styles.spacing} />
				<InvoiceTable invoice={items} />
				<View style={styles.spacing} />
				<Signature trackingInfor={tracking_infor} />
				<View style={styles.spacing} />
				<Footer lookupCode={_id} />
				{tracking_infor.status === states.delivered && <Stamp />}
			</Page>
		</Document>
	);
};

Invoice.propTypes = propTypes;

export default Invoice;
