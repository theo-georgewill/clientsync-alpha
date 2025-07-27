import WorkflowActionItem from "./WorkflowActionItem";

export default function WorkflowActionList({ actions, setActions }) {
  const addAction = () => {
    setActions([...actions, { type: "", settings: {} }]);
  };

  const updateAction = (index, updated) => {
    const newActions = [...actions];
    newActions[index] = updated;
    setActions(newActions);
  };

  const removeAction = (index) => {
    const newActions = actions.filter((_, i) => i !== index);
    setActions(newActions);
  };

  return (
    <div>
      <label className="block font-medium mb-1">Actions</label>
      {actions.map((action, index) => (
        <WorkflowActionItem
          key={index}
          action={action}
          onChange={(updated) => updateAction(index, updated)}
          onRemove={() => removeAction(index)}
        />
      ))}
      <button type="button" onClick={addAction} className="mt-2 text-blue-600 underline">
        + Add Action
      </button>
    </div>
  );
}
