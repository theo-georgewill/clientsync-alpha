import { useEffect, useState } from "react";
import Board, { moveCard } from "@lourenci/react-kanban";
import "@lourenci/react-kanban/dist/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchPipelines } from "@/store/slices/pipelineSlice";
import { fetchDeals, updateDealStage } from "@/store/slices/dealSlice";
import api from "@/services/api"; // Make sure this points to your Axios wrapper

export default function Deals() {
	const dispatch = useDispatch();
	const { pipelines } = useSelector((state) => state.pipelines);
	const { deals } = useSelector((state) => state.deals);

	const [board, setBoard] = useState({ columns: [] });
	const [syncing, setSyncing] = useState(false);

	// Load on mount
	useEffect(() => {
		dispatch(fetchPipelines());
		dispatch(fetchDeals());
	}, [dispatch]);

	// Rebuild board when pipelines or deals change
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
					title: `${pipeline.label}: ${stage.label}`,
					cards,
				});
			});
		});

		setBoard({ columns });
	}, [pipelines, deals]);

	// Sync handler
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

	// Handle card movement
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

			<div className="w-100 overflow-auto">
				<Board onCardDragEnd={handleCardMove} disableColumnDrag>
					{board}
				</Board>
			</div>

		</>
	);
}
