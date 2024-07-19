/* eslint-disable react/prop-types */

export default function DeleteDialog({ deleteUsername, handleDeleteConfirmed, handleDeleteCancelled}) {
  return (
    <div className="dailog_delete_box">
    <p>Are you sure you want to delete {deleteUsername}?</p>
    <div>
      <button className="yes" onClick={handleDeleteConfirmed}>
        Yes
      </button>
      <button className="no" onClick={handleDeleteCancelled}>
        No
      </button>
    </div>
  </div>
  )
}
