/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import axios from 'axios';
import Slide from '@mui/material/Slide';

import { BsCardList } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { BsPersonPlus } from "react-icons/bs";
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import { Table, TableHead, TableBody, TableRow, Button, Dialog, IconButton } from '@mui/material';
import { getUserPaginate, apiUser,  getMemberStatus, baseUrl  } from '../../api/api';
import { StyledTableCell } from './style/Styled';

import GetToken from '../../components/token/GetToken'
import testImage from '../../assets/test_logo.png';
import FormAdd from "./Forms/FormAdd";
import FormUpdate from "./Forms/FormUpdate";
import InfoDialog from './dialogInfo/InfoDialog';
import DeleteDialog from './dialogInfo/DeleteDialog';

export default function UsersPage() {
  const csrfToken = GetToken()
  const [status, setStatus] = useState([]);
  const [data, setData] = useState([]); 
  const [displayedData, setDisplayedData] = useState([]); 
  const [filterBy, setFilterBy] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(100);

  const [hasMore, setHasMore] = useState(true);
  const [loadingInitial, setLoadingInitial] = useState(true); 
  const [loadingMore, setLoadingMore] = useState(false); 
  const [toggleStatus, setToggleStatus] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [updateFormOpen, setUpdateFormOpen] = useState(false);
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);
  const [addUsersDialogOpen, setAddUsersDialogOpen] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updateData, setUpdateData] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteUsername, setDeleteUsername] = useState(null);

  const [deleteMessage, setDeleteMessage] = useState("");
  const [errorMessage , setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const [count, setCount] = useState(0)
  const [next, setNext] = useState(null)



  



  useEffect(() => {
    let timeoutId;
    const resetMessage = (messageSetter) => {
      timeoutId = setTimeout(() => {
        messageSetter("");
      }, 3000);
    };

    if (deleteMessage) {
      resetMessage(setDeleteMessage);
    }
  
    if (errorMessage) {
      resetMessage(setErrorMessage);
    }

    if(statusMessage) {
      resetMessage(setStatusMessage);
    }

    return () => {
      clearTimeout(timeoutId);
    };

  }, [deleteMessage, errorMessage, statusMessage]);
  

  
  const CloseDialogAdd = () => {
    setAddUsersDialogOpen(false);
  };

  const CloseDialogUpdate = () => {
    setUpdateFormOpen(false);
  };

  const CloseDialogInfo = () => {
    setOpenDialog(false);
  };

  const OpenDialogAdd = () => {
    setAddUsersDialogOpen(true);
  };

  const OpenDialogUsersInfo = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };


  const OpenDialogUpdate = (selectedItemIndex) => {
    const dataIndex = selectedItemIndex;
    setUpdateData(displayedData[dataIndex]);
    setUpdateFormOpen(true);
    console.log('dataIndex',dataIndex )
  };


  useEffect(() => {
    const fetchData = async () => {
      setLoadingInitial(true);
      try {
        const usersDataResponse = await axios.get(`${getUserPaginate}${currentPage}`);
        const usersInfo = usersDataResponse.data.results.success
        setData(prevData => [...prevData, ...usersInfo]);
        setHasMore(usersInfo.length > 0);
        setCount(usersDataResponse.data.count);
        setNext(usersDataResponse.data.next);
       
        const userStatusResponse = await axios.get(getMemberStatus);
        const  userStatus = userStatusResponse.data.success;
        setStatus(userStatus);
     
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoadingInitial(false);
    };

    fetchData();
  }, [currentPage]);
  

  useEffect(() => {
      setDisplayedData(data.slice(0, perPage * currentPage));
  }, [data, currentPage, perPage]);


  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const response = await axios.get(`${getUserPaginate}${currentPage + 1}`);
      if (response.status === 200) {
        setCurrentPage(prevPage => prevPage + 1);
      } else {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };


  const handlePerPageChange = (value) => {
    setPerPage(value);
    // Calculate the new current page based on the total number of items and the selected value per page
    const newCurrentPage = Math.ceil(dataToDisplay.length / value);
    setCurrentPage(newCurrentPage || 1); // Set current page to 1 if no data is available
  };
  



  const handleStatusChange = async (userId, newStatus) => {
    try {
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
                desc: newStatus === '1' ? 'Active' : (newStatus === '2' ? 'Inactive' : 'Pending')
                // desc: newStatus === '1' ? 'Active' : (newStatus === '2' ? 'Inactive' : 'Pending')
              }
            }
          };
        }
        return item;
      });
      setData(updatedData);
      setStatusMessage('Successfully Status Changed!');
      setSelectedUserId(null); 
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
        setDeleteMessage(`User ${deleteUsername} successfully deleted.`);

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
    setDeleteMessage("");
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  

   // Function to handle filter criteria change
   const handleFilterChange = (event) => {
    setFilterBy(event.target.value);
    setShowFilter(false)
  };

  // Apply filter based on the selected criteria
  const applyFilter = (item) => {
    switch (filterBy) {
      case 'username':
        return item?.username?.toLowerCase().includes(searchQuery.toLowerCase());
      case 'firstname':
        return item?.individual?.first_name?.toLowerCase().includes(searchQuery.toLowerCase());
      case 'lastname':
        return item?.individual?.last_name?.toLowerCase().includes(searchQuery.toLowerCase());
      case 'email':
        return item?.individual?.email?.toLowerCase().includes(searchQuery.toLowerCase());
      default:
        return true; // No filter or invalid filter, return true to include all items
    }
  };

  
  useEffect(() => {
    // Update filtered data whenever search query changes
    if (searchQuery === '') {
      setFilteredData(data);
    }
  }, [searchQuery, data]);
  
  const dataToDisplay = searchQuery ? filteredData.filter(applyFilter) : data.filter(applyFilter);


  return (
    <div className='flex flex-col items-center'>

      <Dialog  maxWidth="md" open={openDialog} onClose={CloseDialogInfo}>
        <InfoDialog selectedItem={selectedItem} baseUrl={baseUrl} testImage={testImage} CloseDialogInfo={CloseDialogInfo} />
      </Dialog>

      <Dialog open={addUsersDialogOpen} TransitionComponent={Slide} onClose={CloseDialogAdd} fullWidth maxWidth="md">
        <FormAdd  onClose={CloseDialogAdd} />
      </Dialog>

      <Dialog open={updateFormOpen} onClose={CloseDialogUpdate} TransitionComponent={Slide} fullWidth maxWidth="md" >
        <FormUpdate  onClose={CloseDialogUpdate} apiEndpoint={apiUser} data={updateData} csrfToken={csrfToken} />
      </Dialog>

      <Dialog open={deleteConfirmationDialogOpen} onClose={handleDeleteCancelled} maxWidth="sm" fullWidth >
         <DeleteDialog deleteUsername={deleteUsername} handleDeleteConfirmed={handleDeleteConfirmed} handleDeleteCancelled={handleDeleteCancelled} />
      </Dialog>
    
      

      


      {errorMessage && ( <div className="message_error"> <p>{errorMessage}</p> </div>  )}
      {deleteMessage && ( <div className="message_success"> <p>{deleteMessage}</p> </div> )}
      {statusMessage && <p className="statusMessage">{statusMessage}</p>}

      <div className='flex flex-col gap-4 w-[97%] rounded-[10px] bg-white items-start p-10'  style={{ overflowX: 'auto' }}>
        <div className="flex justify-between w-full">
        <div className="flex  items-center gap-3 border rounded-sm px-3">
          <input type="text" placeholder="Filter..." value={searchQuery} onChange={handleSearchInputChange}  className="p-2 outline-none" />
          <IconButton aria-label="delete" onClick={toggleFilter}>
          <FilterAltIcon/>
          </IconButton>
              {showFilter && (
                <select value={filterBy} onChange={handleFilterChange}>
                  <option value="username">Username</option>
                  <option value="firstname">First Name</option>
                  <option value="lastname">Last Name</option>
                  <option value="email">Email Address</option>
                </select>
              )}
        </div>

        <Button size='small' variant='contained' startIcon={<BsPersonPlus/>} className="btn_add_users" onClick={OpenDialogAdd}>
          Add Users
        </Button>
        </div>
        <Table>
            <TableHead sx={{backgroundColor:'#0000001b'}}>
              <TableRow >
                <StyledTableCell>No.</StyledTableCell>
                <StyledTableCell>Username</StyledTableCell>
                <StyledTableCell>First Name</StyledTableCell>
                <StyledTableCell>Last Name</StyledTableCell>
                <StyledTableCell>Email Address</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
          <TableBody>
            {loadingInitial ? (
    <TableRow>
      <StyledTableCell colSpan={7}>Loading...</StyledTableCell>
    </TableRow>
  ) : (
    dataToDisplay.length === 0 ? (
      <TableRow>
         <StyledTableCell colSpan={7}>No items found</StyledTableCell>
      </TableRow>
      ) : (
        dataToDisplay.map((item, index) => (
         <TableRow key={index}>
            <StyledTableCell>{index + 1}</StyledTableCell>
            <StyledTableCell>{item?.username ?? "---"}</StyledTableCell>
            <StyledTableCell>{item.individual?.first_name ?? "---"}</StyledTableCell>
            <StyledTableCell>{item.individual?.last_name ?? "---"}</StyledTableCell>
            <StyledTableCell>{item.individual?.email ?? "---"}</StyledTableCell>
            <StyledTableCell sx={{display:'flex', gap:"10px"}} >
                <button  className={`statusBox ${getStatusClassName(item.individual?.memship_status_data?.desc, item.individual)}`} onClick={() => handleStatusButtonClick(item.id)}>
                      {item.individual ?  (item.individual.memship_status_data?.desc ?? "Pending") : "No Individual"}
                </button>

                {selectedUserId === item.id && toggleStatus && item.individual && (
                  <select className="statusSelect" onChange={(e) => handleStatusChange(item.id, e.target.value)}>
                    <option>Select Status</option>
                    {!item.individual && <option value="no-individual">Pending</option>}
                    {item.individual && <option value="">Pending</option>}
                    {status.map((statusItem, index) => ( <option value={statusItem.id} key={index}>{statusItem.desc}</option>))}
                  </select>
                )}
            </StyledTableCell>
            <StyledTableCell>
                    <div className="action_btn_wrapper ">
                      <button className="btn_view_users" onClick={() => OpenDialogUsersInfo(item)}><BsCardList/> </button>
                      <button className="btn_update_users"  onClick={() => OpenDialogUpdate(index)}><FaRegEdit /></button>
                      <button className="btn_delete_users" onClick={(event) => handleDelete(item.id, item.username, event)}><FaTrash/></button>
                    </div>
            </StyledTableCell>
          </TableRow>
          ))))}
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
              size='small'
              sx={{ marginRight: '5px', ...(perPage === value && { backgroundColor: '#378CE7', color: 'white' }) }} // Apply custom style if perPage equals value
            >
              {value}
            </Button>
          ))}
          <p className='text-lg'>Total of: {count}</p>
         </div>
        {hasMore && (
          <div>
            <Button
            size='small'
              variant="contained"
              onClick={handleLoadMore}
              disabled={!next }
            >
              {loadingMore ? 'Loading...' : 'Show More'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}



  