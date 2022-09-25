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




function App() {

    const [data, setData] = useState()


    useEffect(()=>{
        initialData()
    },[])

    const initialData = () => {
        axios
            .get("https://my.api.mockaroo.com/shipments.json?key=5e0b62d0")
            .then(response => {

                setData(response.data)

            })
            .catch(function(error) {

            });
    }

    console.log(data)

  return (

      <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                  <TableRow>
                      <TableCell>Consignee</TableCell>
                      <TableCell align="right">Customer</TableCell>
                      <TableCell align="right">Date</TableCell>
                      <TableCell align="right">Order Number</TableCell>
                      <TableCell align="right">Status</TableCell>
                      <TableCell align="right">Tracking Number</TableCell>
                  </TableRow>
              </TableHead>

              {data ? <TableBody>
                  {data.map((row) => (
                      <TableRow
                          key={row.consignee}
                          sx={{'&:last-child td, &:last-child th': {border: 0}}}
                      >
                          <TableCell component="th" scope="row">
                              {row.consignee}
                          </TableCell>
                          {row.customer ? <TableCell align="right">{row.customer}</TableCell> : <TableCell>N/A</TableCell>
                          }
                          <TableCell align="right">{row.date}</TableCell>
                          <TableCell align="right">{row.orderNo}</TableCell>
                          <TableCell align="right">{row.status}</TableCell>
                          <TableCell align="right">{row.trackingNo}</TableCell>
                      </TableRow>
                  ))}
              </TableBody> : <h1>no data</h1>}
          </Table>
      </TableContainer>
  );
}

export default App;
