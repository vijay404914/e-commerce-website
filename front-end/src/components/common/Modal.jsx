import { X } from "lucide-react";

export default function Modal({
  isOpen,
  title,
  children,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl">

        <div className="flex justify-between items-center border-b p-5">

          <h2 className="text-xl font-semibold">
            {title}
          </h2>

          <button onClick={onClose}>
            <X size={20} />
          </button>

        </div>

        <div className="p-5">
          {children}
        </div>

      </div>

    </div>
  );
}
