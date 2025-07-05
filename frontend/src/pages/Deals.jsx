import { useEffect, useState } from "react";
import Board, { moveCard } from "@lourenci/react-kanban";
import "@lourenci/react-kanban/dist/styles.css";
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
					.filter((deal) => deal.stage?.id === stage.id)
					.map((deal) => ({
						id: deal.id,
						title: deal.dealname,
						description: deal.amount ? `$${deal.amount}` : "No amount",
						stageId: stage.id,
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
	const handleCardClick = (card) => {
		console.log("Clicked deal:", card);
		// TODO: Open deal modal with full info
	};

	return (
		<>
			<div className="flex items-center justify-between mb-4">
				<h4 className="text-xl font-semibold">Deals Board</h4>
				<button
					onClick={handleSyncNow}
					disabled={syncing}
					className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
				>
					{syncing ? "Syncing..." : "Sync Now"}
				</button>
			</div>

			{/* Horizontal Scroll Container */}
			<div
				className="w-100 overflow-x-auto pb-4"
				style={{ whiteSpace: "nowrap" }}
			>
				<div style={{ minWidth: "max-content" }}>
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
