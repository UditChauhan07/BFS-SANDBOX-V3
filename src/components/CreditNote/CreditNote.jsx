import React, { useState, useEffect } from 'react';
import AppLayout from '../AppLayout';
import POPUPS from './POPUPS';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'; // Import custom CSS for additional styling
import ViewPopUp from './ViewPopUp';
import { Modal, Box, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { IoMdRadioButtonOn } from "react-icons/io";
import CloseIcon from '@mui/icons-material/Close';
import { FilterItem } from '../FilterItem';

function CreditNote() {
    const [manufacturerDetails, setManufacturerDetails] = useState([]);
    const [showModal, setShowModal] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedManufacturer, setSelectedManufacturer] = useState(""); // State for selected manufacturer

    // Fetch manufacturer data from POPUPS
    const handleProductSelect = (manufacturers) => {
        setManufacturerDetails(manufacturers);
        console.log('Manufacturer details:', manufacturers); // Debug log
        setShowModal(false);
    };

    useEffect(() => {
        setShowModal(true);
    }, []);

    const handleClose = () => {
        setShowModal(false);
    };

    const handleManufacturerSelect = (manufacturerId) => {
        console.log('Selected Manufacturer ID:', manufacturerId); // Debug log
        setSelectedManufacturer(manufacturerId);
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Filter manufacturers based on the selected manufacturer and search term
    const filteredManufacturers = manufacturerDetails
        .filter(manufacturer => 
            (selectedManufacturer === "" || manufacturer.manufacturerId === selectedManufacturer) &&
            manufacturer.manufacturerName.toLowerCase().includes(searchTerm.toLowerCase())
        );

    console.log('Filtered Manufacturers:', filteredManufacturers); // Debug log

    return (
        <div>
            <AppLayout filterNodes={<>
                <FilterItem
                    minWidth="220px"
                    label="All Brands"
                    name="Manufacturer1"
                    value={selectedManufacturer} // Use selectedManufacturer for value
                    options={manufacturerDetails.map(manufacturer => ({
                        label: manufacturer.manufacturerName,
                        value: manufacturer.manufacturerId,
                    }))}
                    onChange={handleManufacturerSelect} // Handle selection change
                    selectedManufacturer={selectedManufacturer}
                />
                </>}>
                <Modal
                    open={showModal}
                    onClose={handleClose}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '60%',
                        height: 'max-content',
                        bgcolor: 'background.paper',
                        border: 'none',
                        borderRadius: '5px',
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography id="modal-title" variant="h6" component="h2">
                                Select Manufacturer
                            </Typography>
                            <IconButton onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Box id="modal-description" mt={2}>
                            <POPUPS onProductSelect={handleProductSelect} onClose={handleClose} />
                        </Box>
                    </Box>
                </Modal>

                {manufacturerDetails.length > 0 && (
                    <div className="manufacturer-details">
                        <div className="CreditNote_filterTransaction__2uRP9">
                            <div className="search-icon">
                                <img src="https://bfs-portal-sandbox.vercel.app/assets/images/Group235.png" alt="search" />
                            </div>
                            <div className="CreditNote_inputMain__pHygv">
                                <input
                                    className="CreditNote_searchInput__paDPf"
                                    type="text"
                                    placeholder="TYPE TO SEARCH FOR A TRANSACTION"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <TableContainer component={Paper}>
                            <Table className='credit-note-table'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className='credit-note-heading'><h4>PRODUCTS DETAILS</h4></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className='t-body'>
                                    {filteredManufacturers.length > 0 ? (
                                        filteredManufacturers.map((manufacturer, mIndex) => (
                                            manufacturer.creditNotes.map((note, cIndex) => (
                                                <TableRow key={`${mIndex}-${cIndex}`}>
                                                    <TableCell className='manufacturer-name-credit-note'><h6>
                                                        {manufacturer.manufacturerName}
                                                    </h6></TableCell>
                                                    <TableCell>
                                                        <b>+${note.amount.toFixed(2)}</b><br />
                                                        <div className='credit-date'>
                                                            {formatDate(note.date)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className='credit-note-status'>
                                                            {note.status === 'AVAILABLE' ? <>
                                                                <IoMdRadioButtonOn size={27} color="#20C820" /> <br />
                                                            </> : <>
                                                                <IoMdRadioButtonOn size={27} color="#DD8500" />
                                                            </>} <br /> {note.status}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell><ViewPopUp /></TableCell>
                                                </TableRow>
                                            ))
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                No data available for the selected manufacturer.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                )}
            </AppLayout>
        </div>
    );
}

export default CreditNote;
