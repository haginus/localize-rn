import React from 'react';
import './HeaderBar.scoped.scss';
import { AppBar, Toolbar, Button, Typography, IconButton } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import ImportDialog from '../ImportDialog/ImportDialog';
import ExportDialog from '../ImportDialog/ExportDialog';
import SettingsDialog from '../SettingsDialog/SettingsDialog';

export const HeaderBar = () => {

  const [importDialogOpen, setImportDialogOpen] = React.useState(false);
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = React.useState(false);

  return (
    <div>
      <AppBar position="static">
        <Toolbar sx={{ alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Localize RN
          </Typography>
          <Button variant="contained" sx={{ mr: 1 }} color='secondary' onClick={() => setImportDialogOpen(true)}>
            Import
          </Button>
          <Button variant="contained" sx={{ mr: 1 }} color='secondary' onClick={() => setExportDialogOpen(true)}>
            Export
          </Button>
          <IconButton color='secondary' onClick={() => setSettingsDialogOpen(true)}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <ImportDialog open={importDialogOpen} setOpen={setImportDialogOpen} />
      <ExportDialog open={exportDialogOpen} setOpen={setExportDialogOpen} />
      <SettingsDialog open={settingsDialogOpen} setOpen={setSettingsDialogOpen} />
    </div>
  )
};