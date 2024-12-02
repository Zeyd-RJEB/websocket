import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function renderSide(side) {
  // Map of Side codes to labels and colors
  const sideMap = {
    1: { label: 'Buy', color: 'success' }, // Buy
    2: { label: 'Sell', color: 'error' }, // Sell
    3: { label: 'Buy Minus', color: 'info' }, // Buy Minus
    4: { label: 'Sell Plus', color: 'warning' }, // Sell Plus
    5: { label: 'Sell Short', color: 'error' }, // Sell Short
    6: { label: 'Sell Short Exempt', color: 'error' }, // Sell Short Exempt
    7: { label: 'Undisclosed', color: 'default' }, // Undisclosed
    8: { label: 'Cross', color: 'info' }, // Cross
    9: { label: 'Cross Short', color: 'warning' }, // Cross Short

    // Default for unrecognized sides
    UNKNOWN: { label: 'Unknown', color: 'default' },
  };

  // Fallback if Side is not found
  const sideInfo = sideMap[side] || sideMap['UNKNOWN'];

  return (
    <Chip
      label={
        <Typography
          sx={{
            fontWeight: 'light',
            fontSize: '0.7rem',
            display: 'inline-flex',
            alignItems: 'left',
            justifyContent: 'left',
          }}
        >
          {sideInfo.label}
        </Typography>
      }
      color={sideInfo.color}
      size="small"
    />
  );
}


function renderStatus(status) {
  // Map of OrdStatus codes to labels and colors
  const statusMap = {
    0: { label: 'New', color: 'success' }, // New
    1: { label: 'Partially Filled', color: 'info' }, // Partially Filled
    2: { label: 'Filled', color: 'success' }, // Filled
    3: { label: 'Done for Day', color: 'default' }, // Done for Day
    4: { label: 'Canceled', color: 'error' }, // Canceled
    5: { label: 'Replaced', color: 'warning' }, // Replaced
    6: { label: 'Pending Cancel', color: 'warning' }, // Pending Cancel
    7: { label: 'Stopped', color: 'error' }, // Stopped
    8: { label: 'Rejected', color: 'error' }, // Rejected
    9: { label: 'Suspended', color: 'warning' }, // Suspended
    A: { label: 'Pending New', color: 'info' }, // Pending New
    B: { label: 'Calculated', color: 'info' }, // Calculated
    C: { label: 'Expired', color: 'error' }, // Expired
    D: { label: 'Accepted for Bidding', color: 'info' }, // Accepted for Bidding
    E: { label: 'Pending Replace', color: 'warning' }, // Pending Replace

    // Default for unrecognized statuses
    UNKNOWN: { label: 'Unknown', color: 'default' },
  };

  // Fallback if OrdStatus is not found
  const statusInfo = statusMap[status] || statusMap['UNKNOWN'];

  return (
    <Chip
      label={
        <Typography
          sx={{
            fontWeight: 'light',
            fontSize: '0.7rem',
            display: 'inline-flex',
            alignItems: 'left',
            justifyContent: 'left',
          }}
        >
          {statusInfo.label}
        </Typography>
      }
      color={statusInfo.color}
      size="small"
    />
  );
}


function renderExecType(execType) {
  // Map of ExecType codes to labels and colors
  const execTypeMap = {
    0: { label: 'New', color: 'success' }, // New
    1: { label: 'Partial Fill', color: 'info' }, // Partial Fill
    2: { label: 'Fill', color: 'success' }, // Fill
    3: { label: 'Done for Day', color: 'default' }, // Done for Day
    4: { label: 'Canceled', color: 'error' }, // Canceled
    5: { label: 'Replace', color: 'warning' }, // Replace
    6: { label: 'Pending Cancel', color: 'warning' }, // Pending Cancel
    7: { label: 'Stopped', color: 'error' }, // Stopped
    8: { label: 'Rejected', color: 'error' }, // Rejected
    9: { label: 'Suspended', color: 'warning' }, // Suspended
    A: { label: 'Pending New', color: 'info' }, // Pending New
    B: { label: 'Calculated', color: 'info' }, // Calculated
    C: { label: 'Expired', color: 'error' }, // Expired
    D: { label: 'Restated', color: 'info' }, // Restated
    E: { label: 'Pending Replace', color: 'warning' }, // Pending Replace
    F: { label: 'Trade', color: 'success' }, // Trade
    G: { label: 'Trade Correct', color: 'warning' }, // Trade Correct
    H: { label: 'Trade Cancel', color: 'error' }, // Trade Cancel
    I: { label: 'Order Status', color: 'default' }, // Order Status

    // Default for unrecognized ExecType
    UNKNOWN: { label: 'Unknown', color: 'default' },
  };

  // Fallback for unrecognized ExecType
  const execTypeInfo = execTypeMap[execType] || execTypeMap['UNKNOWN'];

  return (
    <Chip
      label={
        <Typography
          sx={{
            fontWeight: 'regular',
            fontSize: '0.7rem',
            display: 'inline-flex',
            alignItems: 'left',
            justifyContent: 'left',
          }}
        >
          {execTypeInfo.label}
        </Typography>
      }
      color={execTypeInfo.color}
      size="small"
    />
  );
}


function renderMsgType(msgType) {
  // Map of MsgType codes to labels and colors
  const msgTypeMap = {
    // Administrative Messages
    A: { label: 'Logon', color: 'success' },
    5: { label: 'Logout', color: 'default' },
    4: { label: 'Sequence Reset', color: 'warning' },
    0: { label: 'Heartbeat', color: 'info' },
    1: { label: 'Test Request', color: 'default' },

    // Order Messages
    D: { label: 'New Order - Single', color: 'success' },
    F: { label: 'Order Cancel Request', color: 'warning' },
    G: { label: 'Order Cancel/Replace Request', color: 'warning' },
    8: { label: 'Execution Report', color: 'info' },

    // Trade Messages
    9: { label: 'Order Cancel Reject', color: 'error' },
    Q: { label: 'Quote Request', color: 'info' },

    UNKNOWN: { label: 'Unknown', color: 'error' },
  };

  // Fallback if MsgType is not found
  const msgTypeInfo = msgTypeMap[msgType] || msgTypeMap['UNKNOWN'];

  return (
    <Chip
      label={
        <Typography
          sx={{
            fontWeight: 'light',
            fontSize: '0.7rem',
            display: 'inline-flex',
            alignItems: 'left',
            justifyContent: 'left',
          }}
        >
          {msgTypeInfo.label}
        </Typography>
      }
      color={msgTypeInfo.color}
      size="small"
    />
  );
}


export function renderAvatar(params) {
  if (params.value == null) {
    return '';
  }

  return (
    <Avatar
      sx={{
        backgroundColor: params.value.color,
        width: '24px',
        height: '24px',
        fontSize: '0.85rem',
        resizable: true
      }}
    >
      {params.value.name.toUpperCase().substring(0, 1)}
    </Avatar>
  );
}

export const columns = [
  {
    field: 'MsgType',
    headerName: (
      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
        MsgType
      </Typography>
    ),
    flex: 1,
    headerAlign: 'left',
    align: 'left',
    minWidth: 150,
    resizable: true,
    renderCell: (params) => renderMsgType(params.value),
  },
  {
    field: 'TransactTime',
    headerName: (
      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
        TransactTime
      </Typography>
    ),
    headerAlign: 'left',
    align: 'left',
    flex: 1,
    minWidth: 120,
    renderCell: (params) => (
      <Typography sx={{ fontWeight: 'light', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'left', justifyContent: 'left' }}>
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'OrderID',
    headerName: (
      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
        OrderID
      </Typography>
    ),
    headerAlign: 'left',
    align: 'left',
    flex: 1,
    minWidth: 80,
    renderCell: (params) => (
      <Typography sx={{ fontWeight: 'light', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'left', justifyContent: 'left' }}>
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'ExecID',
    headerName: (
      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
        ExecID
      </Typography>
    ),
    headerAlign: 'left',
    align: 'left',
    flex: 1,
    minWidth: 80,
    renderCell: (params) => (
      <Typography sx={{
        fontWeight: 'light', fontSize: '0.7rem', display: 'inline-flex',
        alignItems: 'left',
        justifyContent: 'left',
      }}>
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'Side',
    headerName: (
      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
        Side
      </Typography>
    ),
    headerAlign: 'left',
    align: 'left',
    flex: 1,
    minWidth: 80,
    resizable: true,
    renderCell: (params) => renderSide(params.value),
  },
  {
    field: 'Price',
    headerName: (
      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
        Price
      </Typography>
    ),
    headerAlign: 'left',
    align: 'left',
    flex: 1,
    minWidth: 80,
    renderCell: (params) => (
      <Typography sx={{ fontWeight: 'light', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'left', justifyContent: 'left' }}>
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'OrdStatus',
    headerName: (
      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
        OrdStatus
      </Typography>
    ),
    headerAlign: 'left',
    align: 'left',
    flex: 1,
    minWidth: 120,
    renderCell: (params) => renderStatus(params.value),
  },
  {
    field: 'Symbol',
    headerName: (
      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
        Symbol
      </Typography>
    ),
    headerAlign: 'left',
    align: 'left',
    flex: 1,
    minWidth: 80,
    renderCell: (params) => (
      <Typography sx={{
        fontWeight: 'light', fontSize: '0.7rem', display: 'inline-flex',
        alignItems: 'left',
        justifyContent: 'left',
      }}>
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'OrderQty',
    headerName: (
      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
        OrderQty
      </Typography>
    ),
    headerAlign: 'left',
    align: 'left',
    flex: 1,
    minWidth: 80,
    renderCell: (params) => (
      <Typography sx={{
        fontWeight: 'light', fontSize: '0.7rem', display: 'inline-flex',
        alignItems: 'left',
        justifyContent: 'left',
      }}>
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'ExecType',
    headerName: (
      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
        ExecType
      </Typography>
    ),
    headerAlign: 'left',
    align: 'left',
    flex: 1,
    minWidth: 100,
    renderCell: (params) => renderExecType(params.value),
  },
];

export const rows = [
];
