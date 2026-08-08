function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
            onMouseDown={onClose}
        >
            <div
                className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="mb-6 flex items-center justify-between">

                    <h2 className="text-xl font-semibold text-white">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-2xl text-slate-400 transition hover:text-white"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>

                </div>

                {children}

            </div>
        </div>
    );
}

export default Modal;