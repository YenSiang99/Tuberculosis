// DataViewer.js
import React from 'react';
import Box from '@mui/material/Box';

const DataViewer = ({ data }) => (
  <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { sm: "240px", md: "240px" } }}>
    <pre style={{ overflowX: "auto", backgroundColor: "#f5f5f5", padding: "1rem" }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  </Box>
);

export default DataViewer;
