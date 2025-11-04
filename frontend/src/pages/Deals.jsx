import { useEffect, useState } from "react";
import { Table, Button, Form, InputGroup, Modal } from 'react-bootstrap';
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

	// Modal State
	const [showModal, setShowModal] = useState(false);
	const [form, setForm] = useState({
		dealname: "",
		amount: "",
		pipeline_id: "",
		stage_id: "",
	});
	const [creating, setCreating] = useState(false);

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
					stage_id: parseInt(stage.id),
					},
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

	// Move card (drag-drop)
	const handleCardMove = async (card, source, destination) => {
		try {
			const updatedBoard = moveCard(board, source, destination);
			setBoard(updatedBoard);

			if (source.fromColumnId !== destination.toColumnId) {
				await dispatch(
					updateDealStage({
						id: card.metadata.deal_id,
						stage_id: destination.toColumnId,
					})
				).unwrap();
			}
		} catch (err) {
			console.error("Failed to move card", err);
			setBoard(board);
		}
	};

	// Create deal modal handlers
	const handleShowModal = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);

	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const handleCreateDeal = async (e) => {
		e.preventDefault();
		try {
			setCreating(true);

			const selectedPipeline = pipelines.find(
				(p) => p.pipeline_id === form.pipeline_id
			);
			const selectedStage = selectedPipeline?.stages.find(
				(s) => s.stage_id === form.stage_id
			);

			  // ✅ Construct full payload
			const payload = {
				...form,
				pipeline: selectedPipeline?.label || "",
				dealstage: selectedStage?.label || "",
			};

			await api.post("/api/deals", payload);
			handleCloseModal();
			await dispatch(fetchDeals());
			alert("Deal created successfully!");
		} catch (err) {
			console.error("Failed to create deal", err);
			alert("Failed to create deal.");
		} finally {
			setCreating(false);
		}
	};

  return (
    <>
      	<div className="d-flex items-center justify-content-between mb-4" style={{ width: "90%" }}>
        	<h4 className="text-xl font-semibold">Deals Board</h4>
			<div>
				<Button onClick={handleShowModal} variant="primary" className="me-2">
					+ Add Deal
				</Button>
			</div>
      	</div>

      {/* Deals Board */}
      <div className="overflow-x-auto pb-4" style={{ whiteSpace: "nowrap" }}>
        <div style={{ width: "90%" }}>
			<Board
				onCardDragEnd={handleCardMove}
				disableColumnDrag
				renderCard={(card) => (
				<div
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

      {/* 🧩 Create Deal Modal */}
		<Modal show={showModal} onHide={handleCloseModal} centered>
			<Modal.Header closeButton>
				<Modal.Title>Create New Deal</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleCreateDeal}>
				<Modal.Body>
					<Form.Group className="mb-3">
						<Form.Label>Deal Name</Form.Label>
						<Form.Control
							name="dealname"
							value={form.dealname}
							onChange={handleChange}
							required
							placeholder="Enter deal name"
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Amount</Form.Label>
						<Form.Control
							name="amount"
							type="number"
							value={form.amount}
							onChange={handleChange}
							placeholder="Enter amount"
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Pipeline</Form.Label>
						<Form.Select
							name="pipeline_id"
							value={form.pipeline_id}
							onChange={handleChange}
							required
						>
							<option value="">Select a pipeline</option>
							{pipelines.map((p) => (
							<option key={p.id} value={p.pipeline_id}>
								{p.label}
							</option>
							))}
						</Form.Select>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Stage</Form.Label>
						<Form.Select
							name="stage_id"
							value={form.stage_id}
							onChange={handleChange}
							required
						>
							<option value="">Select a stage</option>
							{pipelines
							.flatMap((p) => p.stages)
							.map((stage) => (
								<option key={stage.id} value={stage.stage_id}>
								{stage.label}
								</option>
							))}
						</Form.Select>
					</Form.Group>
				</Modal.Body>

				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseModal}>
						Cancel
					</Button>
					<Button type="submit" variant="primary" disabled={creating}>
						{creating ? "Creating..." : "Create Deal"}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
    </>
  );
}
