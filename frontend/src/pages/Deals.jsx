import { useEffect, useState } from "react";
import { Table, Button, Form, InputGroup } from 'react-bootstrap';
import Board, { moveCard } from "@asseinfo/react-kanban";
import "@asseinfo/react-kanban/dist/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchPipelines } from "@/store/slices/pipelineSlice";
import { fetchDeals, updateDealStage } from "@/store/slices/dealSlice";
import api from "@/services/api"; // Axios wrapper

export default function Deals() {
	const dispatch = useDispatch();
	const { pipelines } = useSelector((state) => state.pipelines);
	const { deals } = useSelector((state) => state.deals);

	const [board, setBoard] = useState({ columns: [] });
	const [syncing, setSyncing] = useState(false);

	// Load pipelines + deals on mount
	useEffect(() => {
		dispatch(fetchPipelines());
		dispatch(fetchDeals());
	}, [dispatch]);

	// Rebuild board whenever pipelines or deals change
	useEffect(() => {
		const columns = [];

		pipelines.forEach((pipeline) => {
			pipeline.stages.forEach((stage) => {
				const cards = deals
					.filter((deal) => deal?.stage_id === stage.stage_id)
					.map((deal) => ({
						id: deal.deal_id,
						title: deal.dealname,
						description: deal.amount ? `$${deal.amount}` : "No amount",
						metadata: {
							deal_id: deal.id,
							stage_id: parseInt(stage.id)
						}
					}));

				columns.push({
					id: stage.id,
					title: (
						<div className="flex flex-col">
							<span className="font-semibold text-sm">
								{pipeline.label}: {stage.label}
							</span>
							<span className="text-xs text-gray-500">
								{cards.length} deal{cards.length !== 1 ? "s" : ""}
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
		try {
			//Update UI optimistically
			const updatedBoard = moveCard(board, source, destination);
			setBoard(updatedBoard);
			console.log("Card moved:", card, source, destination, updatedBoard);

			// Only update backend if moved to different column
			if (source.fromColumnId !== destination.toColumnId) {
				try {
					await dispatch(updateDealStage({ 
						id: card.metadata.deal_id, // Use deal_id from metadata
						stage_id: destination.toColumnId
					})).unwrap();
				} catch (err) {
					// Revert on failure
					setBoard(board);	
					console.error("Failed to update deal stage", err);
				}
			}
		} catch (error) {
			console.error("Failed to move card", error);
		}
	};

	// Handle card click (open modal soon)
	const handleCardClick = (card) => {
		console.log("Clicked deal:", card);
	};

	const handleAddContact = () => {
		alert("Add Contact functionality coming soon!");
	};

	return (
		<>
			<div className="d-flex items-center justify-content-between mb-4" style={{width: "90%"}}>
				<h4 className="text-xl font-semibold">Deals Board</h4>
				<div>
					<Button onClick={handleAddContact} variant="primary" className="me-2">+ Add Deal</Button>

					<Button
						onClick={handleSyncNow}
						disabled={syncing}
						variant="success"
					>
						{syncing ? "Syncing..." : "Sync Now"}
					</Button>
				</div>
			</div>

			{/* Horizontal Scroll Container */}
			<div
				className="overflow-x-auto pb-4"
				style={{ whiteSpace: "nowrap" }}
			>
				<div style={{ width: "90%" }}>
					<Board
						onCardDragEnd={handleCardMove}
						disableColumnDrag
						renderCard={(card) => (
							<div
								onClick={() => handleCardClick(card)}
								style={{ cursor: "pointer" }}
								className="p-2 border rounded bg-white shadow-sm hover:bg-gray-100"
							>
								<h5 className="text-sm font-semibold">{card.title}</h5>
								<p className="text-xs text-gray-500">{card.description}</p>
							</div>
						)}
					>
						{board}
					</Board>
				</div>
			</div>
		</>
	);
}
