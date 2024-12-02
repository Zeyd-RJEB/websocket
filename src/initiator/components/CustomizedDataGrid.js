import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import ModalComponent from './ModalComponent'; // Assuming this is a custom component for row details modal

// Memoized badge renderer for enums to avoid unnecessary re-renders
const renderBadge = React.memo((value, fixFieldSpec) => {
  if (!fixFieldSpec?.enums || !fixFieldSpec.enums[value]) {
    return value || 'Unknown'; // If no match, return the value as is
  }

  const enumSpec = fixFieldSpec.enums[value];
  const label = enumSpec?.label || value || 'Unknown';
  const color = enumSpec?.color || 'default';

  return (
    <Chip
      label={label}
      size="small"
      color={color}
      style={{
        fontSize: '0.65rem',  // Even smaller font for badges
        margin: '2px',
        padding: '3px 6px',
        textTransform: 'capitalize',
      }}
    />
  );
});

export default function CustomizedDataGrid({ rows, fixSpec }) {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Custom message when there's no data (using your preferred text)
  const noRowsMessage = (
    <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.75rem' }}>
      No data available to display.
    </p>
  );

  const handleRowClick = (params) => {
    setSelectedRow(params.row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  // Ensure `isValid` is correctly populated
  const columns = Object.keys(rows[0] || {}).map((key) => {
    const fieldSpec = fixSpec[key];

    return {
      field: key,
      headerName: fieldSpec?.label || key, // Use label from fixSpec or fallback to key
      minWidth: 90, // Reduced minimum width to make cells more compact
      flex: 1,
      renderCell: (params) => {
        // Check if field is "isValid" and show the appropriate value
        if (key === 'isValid') {
          return <span style={{ fontSize: '0.65rem' }}>{params.value ? 'Valid' : 'Invalid'}</span>;
        }

        // Render a badge if enums are defined in the fieldSpec
        if (fieldSpec?.enums) {
          return renderBadge(params.value, fieldSpec);
        }

        return <span style={{ fontSize: '0.65rem' }}>{params.value}</span>;
      },
    };
  });

  // Add specific fix for the row per page dropdown style
  const paginationProps = {
    pageSizeOptions: [5, 10, 20, 50],
    rowCount: rows.length,
    style: {
      fontSize: '0.65rem', // Reduced font size for pagination
      color: 'inherit',
    },
  };

  return (
    <>
      <div style={{ height: 800, width: '100%' }}>
        {/* Only show DataGrid if rows exist, otherwise show noRowsMessage */}
        {rows.length > 0 ? (
          <DataGrid
            rows={rows}
            columns={columns}
            autosizeOnMount
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20, 50]}
            onRowClick={handleRowClick}
            pagination
            paginationMode="client"
            noRowsMessage={noRowsMessage}  // Custom no rows message
            {...paginationProps}
            disableSelectionOnClick // Optional: Disable selection on click if not required
            getRowId={(row) => row.id || row.uuid || row.key} // Ensures each row has a unique ID
          />
        ) : (
          noRowsMessage // If no rows, show the no data message
        )}
      </div>

      {open && selectedRow && (
        <ModalComponent
          open={open}
          handleClose={handleClose}
          rowData={selectedRow}
          fixFieldMap={fixSpec}
        />
      )}
    </>
  );
}
