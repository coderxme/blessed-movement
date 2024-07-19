/* eslint-disable react/prop-types */

const UserInfoDialog = ({ selectedItem, baseUrl, testImage, CloseDialogInfo }) => {
  return (
    <div className="p-10 flex flex-col items-center gap-3">
      <div className="bg-white shadow rounded-full p-3">
        <img 
          src={`${baseUrl}${selectedItem.individual?.photo}`} 
          alt=""
          className="w-[200px] h-[200px] object-cover rounded-full"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = testImage; // Replace with the path to your default image
          }} 
        />
      </div>
      <div className="user_box_2">
        <span className="span1">
          <p>First Name</p>
          <p>Last Name</p>
          <p>Username</p>
          <p>Mobile Number</p>
          <p>Email Address</p>
          <p>Date of Birth</p>
          <p>Gender</p>
        </span>
        <span className="span2">
          <p>{selectedItem.individual?.first_name ?? "---"}</p>
          <p>{selectedItem.individual?.last_name ?? "---"}</p>
          <p>{selectedItem?.username ?? "---"}</p>
          <p>{selectedItem.individual?.mobile_number ?? "---"}</p>
          <p>{selectedItem.individual?.email ?? "---"}</p>
          <p>{selectedItem.individual?.birth_date ?? "---"}</p>
          <p>{selectedItem.individual?.gender ?? "---"}</p>
        </span>
      </div>
      <button className="user_dailog_btn_close" onClick={CloseDialogInfo}>Close</button>
    </div>
  );
}

export default UserInfoDialog;
