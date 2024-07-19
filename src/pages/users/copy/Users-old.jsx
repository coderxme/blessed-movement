/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableHead, TableBody, TableRow, TableCell, Button, Dialog } from '@mui/material';
import { getUserPaginate, apiUser,  getMemberStatus, baseUrl  } from '../../../api/api';
import GetToken from '../../../components/token/GetToken'
import testImage from '../../assets/test_logo.png';

import { BsCardList } from "react-icons/bs";
import { RiDeleteBack2Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import Slide from '@mui/material/Slide';

import FormAdd from "../Forms/FormAdd";
import FormUpdate from "../Forms/FormUpdate";

const MyTable = () => {
  const csrfToken = GetToken()
  const [status, setStatus] = useState([]);
  const [data, setData] = useState([]); // State for all fetched data
  const [displayedData, setDisplayedData] = useState([]); // State for data displayed in the table
  const [loadingInitial, setLoadingInitial] = useState(true); // State for initial data fetching
  const [loadingMore, setLoadingMore] = useState(false); // State for loading more data
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(100); // Number of items per page
  const [hasMore, setHasMore] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [toggleStatus, setToggleStatus] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [updateFormOpen, setUpdateFormOpen] = useState(false);
  const [updateData, setUpdateData] = useState(null);

  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteUsername, setDeleteUsername] = useState(null);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");
  const [error, setError] = useState("");


  const [addUsersDialogOpen, setAddUsersDialogOpen] = useState(false);


  useEffect(() => {
    let timeoutId;

    // Reset the success message after 5 seconds
    if (deleteSuccessMessage) {
      timeoutId = setTimeout(() => {
        setDeleteSuccessMessage("");
      }, 3000);
    }

       // Reset the success message after 5 seconds
       if (error) {
        timeoutId = setTimeout(() => {
          setError("");
        }, 3000);
      }

    return () => {
      // Clear the timeout when the component unmounts or when success message changes
      clearTimeout(timeoutId);
    };
  }, [deleteSuccessMessage, error]);

  
  const handleAddUsersDialogClose = () => {
    setAddUsersDialogOpen(false);
  };



  const handleCloseUpdateForm = () => {
    setUpdateFormOpen(false);
  };


  const handleOpenDialog = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenUpdateForm = (selectedItemIndex) => {
    const dataIndex = selectedItemIndex;
    setUpdateData(displayedData[dataIndex]);
    setUpdateFormOpen(true);
    console.log('dataIndex',dataIndex )
  };


  useEffect(() => {
    const fetchData = async () => {
      setLoadingInitial(true);
      try {
        const response = await axios.get(`${getUserPaginate}${currentPage}`);
        setData(prevData => [...prevData, ...response.data.results.success]);
        setHasMore(response.data.results.success.length > 0);
       
        const statusResponse = await axios.get(getMemberStatus);
  
        setStatus(statusResponse.data.success);
     
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoadingInitial(false);
    };

    fetchData();
  }, [currentPage]);

  useEffect(() => {
    if (searchValue === '') {
      // If search value is empty, revert back to displaying all data
      setDisplayedData(data.slice(0, perPage * currentPage));
    } else {
      // If search value is present, filter data accordingly
      handleFilter(searchValue);
    }
  }, [data, currentPage, perPage, searchValue]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const response = await axios.get(`${getUserPaginate}${currentPage + 1}`);
      if (response.status === 200) {
        setCurrentPage(prevPage => prevPage + 1);
      } else {
        console.error('Error fetching data:', response.statusText);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setHasMore(false);
    }
    setLoadingMore(false);
  };

  const handlePerPageChange = (value) => {
    setPerPage(value);
    setCurrentPage(1);
  };

  const handleFilter = (value) => {
    setSearchValue(value);
    const filtered = data.filter(item => item.username.toLowerCase().includes(value.toLowerCase()));
    setDisplayedData(filtered.slice(0, perPage));
    setCurrentPage(1);
  };


  const handleStatusChange = async (userId, newStatus) => {
    try {
      // Make an API request to update the status with CSRF token in the header
      await axios.put(apiUser, {
        individual: {
          user_id: userId,
          memship_status: newStatus
        },
      }, {
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });

      // Update the status in the state
      const updatedData = data.map(item => {
        if (item.id === userId) {
          return {
            ...item,
            individual: {
              ...item.individual,
              memship_status_data: {
                ...item.individual.memship_status_data,
                desc: newStatus === '2' ? 'Active' : (newStatus === '1' ? 'Inactive' : 'Pending')
                // desc: newStatus === '1' ? 'Active' : (newStatus === '2' ? 'Inactive' : 'Pending')
              }
            }
          };
        }
        return item;
      });
      setData(updatedData);
      setStatusMessage('Successfully Status Changed!');
      setSelectedUserId(null); // Close the dropdown after status change
      setTimeout(() => {
        setStatusMessage(null);
      }, 2000);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleStatusButtonClick = (userId) => {
    setSelectedUserId(userId); // Set the selected user ID
    setToggleStatus(!toggleStatus); // Toggle the status modal visibility 
  };


  const getStatusClassName = (status, individual) => {
    if (!status && !individual) {
      return 'no-individual'; // Class name for no status and no individual
    }
  
    switch (status) {
      case 'Active':
        return 'active-status'; // Class name for active
      case 'Inactive':
        return 'inactive-status'; // Class name for inactive
      case 'Pending':
        return 'pending-status'; // Class name for pending
      default:
        return 'pending-status';
    }
  };


  
// Modify the handleDelete function
const handleDelete = (userId,username, event) => {
  // Stop event propagation to prevent opening the dialog
  event.stopPropagation();

  // Set the userId to be deleted and open the confirmation dialog
  setDeleteUserId(userId);
  setDeleteUsername(username);
  setDeleteConfirmationDialogOpen(true);
};

const handleDeleteConfirmed = async () => {
  try {
    // Make an API request to delete the item with CSRF token in the header
    await axios.delete(apiUser, {
      data: { id: deleteUserId },
      headers: {
        'X-CSRFToken': csrfToken,
      },
    });

    // Remove the deleted item from the state
    const updatedData = data.filter(item => item.id !== deleteUserId);
    setData(updatedData);

    // Display success message
    setDeleteSuccessMessage(`User ${deleteUsername} successfully deleted.`);

    // Close the confirmation dialog
    setDeleteConfirmationDialogOpen(false);
  } catch (error) {
    console.error("Error deleting item:", error);
  }
};

const handleDeleteCancelled = () => {
  // Close the confirmation dialog
  setDeleteConfirmationDialogOpen(false);
  // Reset the success message
  setDeleteSuccessMessage("");
};

  


  return (
    <div className='flex flex-col items-center'>
      <Dialog
  open={addUsersDialogOpen}
  TransitionComponent={Slide}
  onClose={handleAddUsersDialogClose}
  fullWidth
  maxWidth="md"
>
  <FormAdd  onClose={handleAddUsersDialogClose} />
</Dialog>

    <Dialog
        open={updateFormOpen}
        onClose={handleCloseUpdateForm}
        TransitionComponent={Slide}
        fullWidth
        maxWidth="md"
      >
        {/* Pass the necessary props to the FormUpdate component */}
        <FormUpdate  
          onClose={handleCloseUpdateForm} 
          apiEndpoint={apiUser} 
          data={updateData} 
          csrfToken={csrfToken}
       />
      </Dialog>

<Dialog
  open={deleteConfirmationDialogOpen}
  onClose={handleDeleteCancelled}
  maxWidth="sm"
  fullWidth
>
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
</Dialog>



{selectedItem && (
      <Dialog  
      maxWidth="md"
      open={openDialog} onClose={handleCloseDialog}>
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
           <button className="user_dailog_btn_close" onClick={handleCloseDialog}>Close</button>
          </div>
      </Dialog>
    )}

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <input type="text" placeholder="Search by name..." value={searchValue} onChange={(e) => handleFilter(e.target.value)} />
      </div>


      {error && (
        <div className="message_error">
          <p>{error}</p>
        </div>
      )}

      {deleteSuccessMessage && (
  <div className="message_success">
    <p>{deleteSuccessMessage}</p>
  </div>
)}




{statusMessage && <p className="statusMessage">{statusMessage}</p>}
      <div className='flex flex-col gap-4 w-[97%] rounded-[10px] bg-white '  style={{ overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>No.</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Email Address</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedData.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item?.username ?? "---"}</TableCell>
              <TableCell>{item.individual?.first_name ?? "---"}</TableCell>
              <TableCell>{item.individual?.last_name ?? "---"}</TableCell>
              <TableCell>{item.individual?.email ?? "---"}</TableCell>
              <TableCell sx={{display:'flex', gap:"10px"}} >
                        <button
                         className={`statusBox ${getStatusClassName(item.individual?.memship_status_data?.desc, item.individual)}`}
                         onClick={() => handleStatusButtonClick(item.id)}>
                        {item.individual ? 
                            (item.individual.memship_status_data?.desc ?? "Pending") :
                            "No Individual"
                          }
                        </button>
                        {selectedUserId === item.id && toggleStatus && item.individual && (
                              <select className="statusSelect" onChange={(e) => handleStatusChange(item.id, e.target.value)}>
                                <option>Select Status</option>
                                {!item.individual && <option value="no-individual">Pending</option>}
                                {item.individual && <option value="">Pending</option>}
                                {status.map((statusItem, index) => (
                                  <option value={statusItem.id} key={index}>{statusItem.desc}</option>
                                ))}
                              </select>
                            )}



                      </TableCell>

                      <TableCell>
                    <div className="action_btn_wrapper ">
                    <button   className="btn_view_users" onClick={() => handleOpenDialog(item)}  >
                        <BsCardList/>
                      </button>
                      <button   className="btn_update_users"  onClick={() => handleOpenUpdateForm(index)}>
                        <FaRegEdit />
                      </button>
                      <button className="btn_delete_users" onClick={(event) => handleDelete(item.id, item.username, event)}>
                        <RiDeleteBack2Line />
                      </button>
                    </div>
                  </TableCell>
            </TableRow>
          ))}
          {loadingInitial && (
            <TableRow>
              <TableCell colSpan="3">Loading...</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>

      <div className='flex justify-between items-center py-3  w-[97%] border-b-1'>
         <div className="flex items-center">
         {[20, 100, 200].map(value => (
            <Button
              key={value}
              variant="outlined"
              onClick={() => handlePerPageChange(value)}
              disabled={data.length <= value} // Disable if data length is less than or equal to per page value
              style={{ marginRight: '5px' }}
              size='small'
              sx={{ marginRight: '5px', ...(perPage === value && { backgroundColor: '#378CE7', color: 'white' }) }} // Apply custom style if perPage equals value
            >
              {value}
            </Button>
          ))}
         </div>
        {hasMore && (
          <div>
            <Button
            size='small'
              variant="contained"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading...' : 'Show More'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTable;
