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
import {Button, CircularProgress, styled, tableCellClasses, Typography} from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ClearIcon from '@mui/icons-material/Clear';

function App() {

    const [data, setData] = useState()
    const [open, setOpen] = useState()
    const [error, setError] = useState(null);

    const StyledTableCell = styled(TableCell)(({theme}) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#f6f9fc',
            color: '#88a4c7',
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
            backgroundColor: '#ffffff',
        },
    }));

    const handleClickOpen = () => {
        setOpen(true);
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

                }).catch(error => {
                setError(error);
                console.log(error)
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

    console.log(data)

    return (
        <div>

            {data ? <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>ORDERNO</StyledTableCell>
                                <StyledTableCell align="right">DELIVERY DATE</StyledTableCell>
                                <StyledTableCell align="right">CUSTOMER</StyledTableCell>
                                <StyledTableCell align="right">TRACKING NO</StyledTableCell>
                                <StyledTableCell align="right">STATUS</StyledTableCell>
                                <StyledTableCell align="right">CONSIGNEE</StyledTableCell>
                                <StyledTableCell align="right"></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow
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
                                    <TableCell><Button variant="contained"><CalendarMonthIcon/></Button>
                                        <Button variant='contained'
                                                sx={{backgroundColor: 'red'}}><ClearIcon/></Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer> :
                <div align='center'><Typography variant="h1" gutterBottom>Data Loading</Typography><CircularProgress/>
                </div>}

        </div>
    );
}

export default App;
