import { useEffect, useState } from "react";
import Board, { moveCard } from "@lourenci/react-kanban";
import { Modal, Button } from "react-bootstrap";
import "@lourenci/react-kanban/dist/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchPipelines } from "@/store/slices/pipelineSlice";
import { fetchDeals, updateDealStage } from "@/store/slices/dealSlice";
import api from "@/services/api"; 

export default function Deals() {

	const dispatch = useDispatch();
	const { pipelines } = useSelector((state) => state.pipelines);
	const { deals } = useSelector((state) => state.deals);

	const [selectedDeal, setSelectedDeal] = useState(null);
	const [showModal, setShowModal] = useState(false);

	const [board, setBoard] = useState({ columns: [] });
	const [syncing, setSyncing] = useState(false);

	// Load pipelines + deals on mount using redux
	useEffect(() => {
		dispatch(fetchPipelines());
		dispatch(fetchDeals());
	}, [dispatch]);

	// Rebuild board whenever pipelines or deals change
	useEffect(() => {
		const columns = [];

		pipelines.forEach((pipeline) => {
			pipeline.stages.forEach((stage) => {
				{/* create deal cards */}
				const cards = deals
					.filter((deal) => deal.stage_id === stage.stage_id)
					.map((deal) => ({
						id: deal.id,
						title: deal.dealname,
						description: deal.amount ?  
							new Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "USD",
							}).format(deal.amount) : "No amount",
						stageId: deal.stage_id,
					}));	

				{/* create kanban stage columns*/}
				columns.push({
					id: stage.stage_id,
					title: (
						<div className="d-flex justify-content-between flex-row">
							<span className="font-semibold text-sm">
								{stage.label}
							</span>
							<span className="text-xs text-gray-500">
								{cards.length} 
							</span>
						</div>
					),
					cards,
				});
			});
		});

		setBoard({ columns });
	}, [pipelines, deals]);

	// Sync data manually
	const handleSyncNow = async () => {
		try {
			setSyncing(true);
			await api.post("/api/hubspot/sync");
			await dispatch(fetchPipelines());
			await dispatch(fetchDeals());
		} catch (err) {
			console.error("Sync failed", err);
			alert("Failed to sync. Check console or logs.");
		} finally {
			setSyncing(false);
		}
	};

	// Drag card to new column = update deal stage
	const handleCardMove = async (card, source, destination) => {
		const updatedBoard = moveCard(board, source, destination);
		setBoard(updatedBoard);

		if (source.fromColumnId !== destination.toColumnId) {
			try {
				await dispatch(
					updateDealStage({ id: card.id, stage_id: destination.toColumnId })
				);
			} catch (err) {
				console.error("Failed to update deal stage", err);
			}
		}
	};

	// Handle card click (open modal soon)
	const handleCardClick = (deal) => {
		console.log("Clicked deal:", deal);
		setSelectedDeal(deal);
		setShowModal(true);
	};

	const handleClose = () => {
		setShowModal(false);
	}
	return (
		<>
			<div className="py-4">
				{/* Manual Sync Button */}
				<div className="d-flex items-center justify-content-between mb-4">
					<h4 className="text-xl font-semibold">Deals Board</h4>
					<button
						onClick={handleSyncNow}
						disabled={syncing}
						className="px-4 py-2 me-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
					>
						{syncing ? "Syncing..." : "Sync Now"}
					</button>
				</div>

				{/* Kanban Board */}
				<div
					className="d-flex py-4  overflow-auto "
					style={{ whiteSpace: "nowrap" }}
				>
					<div style={{ minWidth: "max-content" }}>
						<Board
							onCardDragEnd={handleCardMove}
							disableColumnDrag
							renderCard={(card) => (
								<div
									onClick={() => handleCardClick(card)}
									style={{ cursor: "pointer", minwidth: "100%" }}
									className="my-2 w-100 p-2 border rounded bg-white shadow-sm hover:bg-gray-100"
								>
									<h5 className="text-sm font-semibold">{card.title}</h5>
									<p className="text-xs font-semibold">Amount: {card.description}</p>
								</div>
							)}
						>
							{board}
						</Board>
					</div>
				</div>
			</div>
			<Modal show={showModal} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>{selectedDeal?.title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>{selectedDeal?.description}</p>
					{/* Add more details here */}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					{/* Add more actions like Edit, Delete, etc. */}
				</Modal.Footer>
			</Modal>
		</>
	);
}
