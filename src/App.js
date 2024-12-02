import React from 'react';
import Initiator from './initiator/Initiator';
import { SnackbarProvider, useSnackbar } from 'notistack';

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
    <div className="App">
      <Initiator />
    </div>
    </SnackbarProvider>
  );
}

export default App;

