const ViewPdfButton = () => {
	const getDocumentIdFromUrl = () => {
		const pathParts = window.location.pathname.split("/");
		return pathParts[pathParts.length - 1];
	};

	const isBookingOrderPdf = () => {
		const pathParts = window.location.pathname.split("/");
		return pathParts[4] === "api::booking-order-pdf.booking-order-pdf";
	};

	if ("create" === getDocumentIdFromUrl() || !isBookingOrderPdf()) {
		return null;
	}

	const handleClick = () => {
		const documentId = getDocumentIdFromUrl();
		const pdfUrl = `/pdfs/booking-orders-${documentId}.pdf`;
		window.open(pdfUrl, "_blank");
	};

	return (
		<button
			onClick={handleClick}
			style={{
				padding: "8px 16px",
				backgroundColor: "#4945FF",
				color: "white",
				border: "none",
				borderRadius: "4px",
				cursor: "pointer",
				fontWeight: "bold",
				marginTop: "10px",
			}}
		>
			View PDF
		</button>
	);
};

export default ViewPdfButton;
