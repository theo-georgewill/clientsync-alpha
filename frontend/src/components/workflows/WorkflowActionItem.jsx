export default function WorkflowActionItem({ action, onChange, onRemove }) {
  const handleTypeChange = (e) => {
    onChange({ ...action, type: e.target.value, settings: {} });
  };

  const handleSettingChange = (key, value) => {
    onChange({ ...action, settings: { ...action.settings, [key]: value } });
  };

  return (
    <div className="border p-3 rounded mb-2 bg-gray-50">
      <select value={action.type} onChange={handleTypeChange} className="w-full mb-2 p-2 border rounded">
        <option value="">Select Action Type</option>
        <option value="send_slack_message">Send Slack Message</option>
        <option value="update_google_sheet">Update Google Sheet</option>
        {/* Add more actions here */}
      </select>

      {action.type === "send_slack_message" && (
        <>
          <input
            type="text"
            placeholder="Slack Webhook URL"
            className="w-full mb-2 p-2 border rounded"
            onChange={(e) => handleSettingChange("webhook_url", e.target.value)}
          />
          <input
            type="text"
            placeholder="Message"
            className="w-full p-2 border rounded"
            onChange={(e) => handleSettingChange("message", e.target.value)}
          />
        </>
      )}

      {action.type === "update_google_sheet" && (
        <>
          <input
            type="text"
            placeholder="Sheet URL"
            className="w-full p-2 border rounded"
            onChange={(e) => handleSettingChange("sheet_url", e.target.value)}
          />
        </>
      )}

      <button type="button" onClick={onRemove} className="mt-2 text-red-600 underline">
        Remove
      </button>
    </div>
  );
}
