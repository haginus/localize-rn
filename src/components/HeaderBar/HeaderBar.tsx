import React from 'react';
import './HeaderBar.scoped.scss';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import ImportDialog from '../ImportDialog/ImportDialog';

export const HeaderBar = () => {

  const [importDialogOpen, setImportDialogOpen] = React.useState(false);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Localize RN
          </Typography>
          <Button variant="contained" sx={{ mr: 1 }} color='secondary' onClick={() => setImportDialogOpen(true)}>
            Import
          </Button>
          <Button variant="contained" color='secondary'>Export</Button>
        </Toolbar>
      </AppBar>
      <ImportDialog open={importDialogOpen} setOpen={setImportDialogOpen} />
    </div>
  )
};