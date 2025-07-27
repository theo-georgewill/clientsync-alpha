export default function WorkflowTriggerPicker({ trigger, setTrigger }) {
  const handleChange = (e) => {
    const type = e.target.value;
    setTrigger({ type, data: {} });
  };

  return (
    <div>
      <label className="block mb-1 font-medium">Trigger</label>
      <select value={trigger.type} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="">Select Trigger</option>
        <option value="deal_stage_changed">Deal moved to stage</option>
        {/* Add more trigger types here */}
      </select>

      {trigger.type === "deal_stage_changed" && (
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            placeholder="From stage (e.g. Qualified)"
            className="flex-1 p-2 border rounded"
            onChange={(e) =>
              setTrigger((prev) => ({
                ...prev,
                data: { ...prev.data, from: e.target.value }
              }))
            }
          />
          <input
            type="text"
            placeholder="To stage (e.g. Closed Won)"
            className="flex-1 p-2 border rounded"
            onChange={(e) =>
              setTrigger((prev) => ({
                ...prev,
                data: { ...prev.data, to: e.target.value }
              }))
            }
          />
        </div>
      )}
    </div>
  );
}
