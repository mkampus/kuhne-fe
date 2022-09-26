import logo from './logo.svg';
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
import AppBar from "@mui/material/AppBar";
import {
    Box,
    Button,
    CardHeader,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    styled,
    tableCellClasses,
    TextField,
    Typography
} from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ClearIcon from '@mui/icons-material/Clear';
import jsonData from "./Shipments.json";

function App() {

    const [data, setData] = useState(null)
    const [open, setOpen] = useState()
    const [error, setError] = useState(null);
    const [selectedData, setSelectedData] = useState()
    const [textFieldEnabler, setTextFieldEnabler] = useState(true)

    const StyledTableCell = styled(TableCell)(({theme}) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#f6f9fc', color: '#88a4c7',
        }, [`&.${tableCellClasses.body}`]: {
            fontSize: 14, backgroundColor: '#ffffff',
        },
    }));

    const handleClickOpen = (props) => {
        setOpen(true);
        setSelectedData(props)
    };

    const handleClose = () => {
        setOpen(false);
    };

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
                    console.log(data)
                }


            });


        }
        initialData()
    }, [])


    // const initialData =  () => {
    //     axios
    //         .get("https://my.api.mockaroo.com/shipments.json?key=5e0b62d0")
    //         .then(response => {
    //
    //             setData(response.data)
    //
    //         })
    //         .catch(function (error) {
    //         });
    // }

    const deleteOrder = (props) => {

        const deletedOrder = data.filter(row => {
            return row.orderNo !== props;
        });
        setData(deletedOrder)
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

        {selectedData ? <Dialog maxWidth='lg'
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
                        <TextField fullWidth id="outlined-read-only-input" disabled={textFieldEnabler}
                                   fullWidth value={selectedData.orderNo}></TextField></div>
                    <div> Customer
                        <TextField fullWidth id="outlined-basic" disabled={textFieldEnabler}
                                   value={selectedData.customer}> </TextField></div>

                    <div> Consignee
                        <TextField fullWidth id="outlined-basic" disabled={textFieldEnabler}
                                   value={selectedData.consignee}> </TextField></div>
                    <div> Date
                        <TextField fullWidth id="outlined-basic" disabled={textFieldEnabler}
                                   value={selectedData.date}> </TextField></div>
                    <div> TrackingNo
                        <TextField fullWidth id="outlined-basic" disabled={textFieldEnabler}
                                   value={selectedData.trackingNo}> </TextField></div>
                    <div> Status
                        <TextField fullWidth id="outlined-basic" disabled={textFieldEnabler}
                                   value={selectedData.status}> </TextField></div>

                    {/*<DialogContentText>*/}
                    {/*    {filmData.overview}*/}
                    {/*    {filmData.homepage}*/}
                    {/*</DialogContentText>*/}

                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog> : <div></div>}

    </div>);
}

export default App;
