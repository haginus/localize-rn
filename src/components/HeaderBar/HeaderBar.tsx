import './HeaderBar.scoped.scss';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';

export const HeaderBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Localize RN
        </Typography>
        <Button variant="contained" sx={{ mr: 1 }} color='secondary'>Import</Button>
        <Button variant="contained" color='secondary'>Export</Button>
      </Toolbar>
    </AppBar>
  )
};