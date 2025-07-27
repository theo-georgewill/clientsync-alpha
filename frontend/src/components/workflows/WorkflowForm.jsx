import { useState } from "react";
import WorkflowTriggerPicker from "./WorkflowTriggerPicker";
import WorkflowActionList from "./WorkflowActionList";

export default function WorkflowForm({ onClose }) {
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState({ type: "", data: {} });
  const [actions, setActions] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      trigger_type: trigger.type,
      trigger_data: trigger.data,
      actions
    };

    await fetch("/api/workflows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Workflow Name"
        className="w-full p-2 border rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <WorkflowTriggerPicker trigger={trigger} setTrigger={setTrigger} />

      <WorkflowActionList actions={actions} setActions={setActions} />

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Save Workflow
        </button>
      </div>
    </form>
  );
}
