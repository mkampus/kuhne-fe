import './App.css';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useEffect, useState} from "react";
import axios from "axios";
import {
    Box,
    Button,
    CardHeader,
    CircularProgress, createTheme,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    styled,
    tableCellClasses,
    TextField, ThemeProvider,
    Typography
} from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ClearIcon from '@mui/icons-material/Clear';

function App() {

    const [data, setData] = useState(null)
    const [open, setOpen] = useState()
    const [error, setError] = useState(null);
    const [selectedData, setSelectedData] = useState()
    const [textFieldDisabler, setTextFieldDisabler] = useState(true)
    const [userChange, setUserChange] = useState()
    const [userData, setUserData] = useState({})
    const [indexOfData, setIndexOfData] = useState()


    //// Table Theme

    const StyledTableCell = styled(TableCell)(({theme}) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#f6f9fc', color: '#88a4c7',
        }, [`&.${tableCellClasses.body}`]: {
            fontSize: 14, backgroundColor: '#ffffff',
        },
    }));


    //// Dialogue Text Theme

    const finalTheme = createTheme({
        components: {
            MuiTextField: {
                variants: [
                    {
                        props: { variant: 'outlined', disabled: true},
                        style: {
                            backgroundColor: '#f6f9fc',
                            fontSize: '5rem',
                            color: 'warning',

                        },
                    }
                ]

            }
        }
    })

/// useEffect runs once. Since the API would get overrun, this also checks for that and reverts to an offline .json if necessary

    useEffect(() => {

        const initialData = () => {
            axios
                .get("https://my.api.mockaroo.com/shipments.json?key=5e0b62d0")
                .then(response => {
                    setData(response.data)
                    console.log(data)
                }).catch(error => {

                setError(error);
                console.log(error)
                if (error.response.status === 429) {
                    let jsonData = require('./Shipments.json');
                    setData(jsonData)
                    console.log("Error loading data. Loading offline data instead.")
                }
            });
        }
        initialData()
    }, [])

    /// Simple filter goes through the data and finds what to delete based on orderNo

    const deleteOrder = (props) => {
        const deletedOrder = data.filter(row => {
            return row.orderNo !== props;
        });
        setData(deletedOrder)
    }

/// Dialogue open and close functions. Open takes in and sets the data that will be manipulated

    const handleClickOpen = (props) => {
        setOpen(true);
        setSelectedData(props)
        console.log(selectedData)
        setIndexOfData(data.indexOf(props))
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedData(null)
        setTextFieldDisabler(true)
    };


    // Handles user inputs into textfields. Feels slow and laggy at the moment and is subject to change once I figure
    // out what the issue is

    const handleChange = (e, name) => {
        setUserChange(e)

        // nifty little function for getting a dynamic key instead of the if logic chain I had here before

            const getKey = () => {
                return name;
            }
        setUserData({...userData, [getKey()]: e});

    }

    // Function to save all the new details and add them to the original data state. Though this could be done in
    // in various ways, I had some odd bugs with Object.assign so I chose to just do it by finding the index and
    // replacing the values therein.


    const saveNewDetails = () => {
        let merge = {
            ...selectedData,
            ...userData
        }
        let newState = [...data]
        newState[indexOfData] = merge
        setData(newState)
        setUserChange(null)
        setTextFieldDisabler(true)
    }



    return (<div>
        {data ? <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="right">ORDERNO</StyledTableCell>
                            <StyledTableCell align="right">DELIVERY DATE</StyledTableCell>
                            <StyledTableCell align="right">CUSTOMER</StyledTableCell>
                            <StyledTableCell align="right">TRACKING NO</StyledTableCell>
                            <StyledTableCell align="right">STATUS</StyledTableCell>
                            <StyledTableCell align="right">CONSIGNEE</StyledTableCell>
                            <StyledTableCell align="right"></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (<TableRow
                            key={row.trackingNo}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row">
                                {row.orderNo}
                            </TableCell>
                            <TableCell align="right">{row.date}</TableCell>
                            <TableCell align="right">{row.customer}</TableCell>
                            <TableCell align="right">{row.trackingNo}</TableCell>
                            <TableCell align="right">{row.status}</TableCell>
                            <TableCell align="right">{row.consignee}</TableCell>
                            <TableCell><Button onClick={() => handleClickOpen(row)}
                                               variant="contained"><CalendarMonthIcon/></Button>
                                <Button variant='contained'
                                        sx={{backgroundColor: 'red'}}
                                        onClick={() => deleteOrder(row.orderNo)}><ClearIcon/></Button></TableCell>
                        </TableRow>))}
                    </TableBody>
                </Table>
            </TableContainer> :
            <div align='center'><Typography variant="h1" gutterBottom>Data Loading</Typography><CircularProgress/>


            </div>}

        {selectedData ? <ThemeProvider theme={finalTheme}><Dialog maxWidth='lg'
                                open={open}
                                onClose={handleClose}
                                hideBackdrop={true}
        >
            <DialogTitle variant='h5' align="center"
            >Shipment Details:</DialogTitle>
            <DialogContent style={{overflow: "hidden", overflowY: 'hidden'}}>

                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': {m: 1, width: '80ch'},
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <div> OrderNo:
                        <TextField variant={"outlined"} fullWidth name='orderNo' disabled={textFieldDisabler}
                                   placeholder={selectedData.orderNo} onChange={(e) => {
                            handleChange(e.target.value, e.target.name)
                        }}></TextField></div>
                    <div> Customer
                        <TextField fullWidth name="customer" disabled={textFieldDisabler}
                                   placeholder={selectedData.customer} onChange={(e) => {
                            handleChange(e.target.value, e.target.name)
                        }}> </TextField></div>
                    <div> Consignee
                        <TextField fullWidth name="consignee" disabled={textFieldDisabler}
                                   placeholder={selectedData.consignee} onChange={(e) => {
                            handleChange(e.target.value, e.target.name)
                        }}> </TextField></div>
                    <div> Date
                        <TextField fullWidth name="date" disabled={textFieldDisabler}
                                   placeholder={selectedData.date} onChange={(e) => {
                            handleChange(e.target.value, e.target.name)
                        }}> </TextField></div>
                    <div> TrackingNo
                        <TextField fullWidth name="trackingNo" disabled={textFieldDisabler}
                                   placeholder={selectedData.trackingNo} onChange={(e) => {
                            handleChange(e.target.value, e.target.name)
                        }}> </TextField></div>
                    <div> Status
                        <TextField fullWidth name="status" disabled={textFieldDisabler}
                                   placeholder={selectedData.status} onChange={(e) => {
                            handleChange(e.target.value, e.target.name)
                        }}> </TextField></div>

                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
                <Button onClick={() => setTextFieldDisabler(false)}>Change Details</Button>
                {userChange ? <Button onClick={() => saveNewDetails(userChange, selectedData)}>Save Details</Button> :
                    <div></div>}
            </DialogActions>
        </Dialog> </ThemeProvider>: <div></div>}

    </div>);
}

export default App;
