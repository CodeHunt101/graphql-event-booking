const Modal = ({
  children,
  canCancel,
  canConfirm,
  onConfirm,
}: {
  children: React.ReactNode
  canCancel: boolean
  canConfirm: boolean
  onConfirm: () => void
}) => {
  return (
    <dialog id="event-modal" className="modal">
      <div className="modal-box">
        {children}
        <div className="modal-action">
          {canConfirm && (
            <button onClick={onConfirm} className="btn">
              Confirm
            </button>
          )}
          <form method="dialog">
            <button className="btn">Cancel</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

export default Modal
