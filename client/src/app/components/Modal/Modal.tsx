const Modal = ({
  children,
  idName,
  canCancel,
  canConfirm,
  confirmText,
  onConfirm,
}: {
  children: React.ReactNode
  idName: string
  canCancel: boolean
  canConfirm: boolean
  confirmText: string
  onConfirm: () => void
}) => {
  return (
    <dialog id={idName} className="modal">
      <div className="modal-box">
        {children}
        <div className="modal-action">
          <form method="dialog">
            {canConfirm && (
              <button onClick={onConfirm} className="btn">
                {confirmText}
              </button>
            )}
            <button className="btn">Cancel</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

export default Modal
