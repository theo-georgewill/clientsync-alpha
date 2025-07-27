import { Dialog } from "@headlessui/react";
import WorkflowForm from "./WorkflowForm";

export default function WorkflowModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-xl bg-white p-6 rounded-xl shadow-lg">
          <Dialog.Title className="text-xl font-bold mb-4">Create Workflow</Dialog.Title>
          <WorkflowForm onClose={onClose} />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
