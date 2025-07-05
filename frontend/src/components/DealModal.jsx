import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function DealModal({ show, onHide, deal }) {
	if (!deal) return null;

	return (
		<Modal show={show} onHide={onHide} centered>
			<Modal.Header closeButton>
				<Modal.Title>{deal.title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p><strong>Amount:</strong> {deal.description}</p>
				<p><strong>Stage ID:</strong> {deal.stageId}</p>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onHide}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
