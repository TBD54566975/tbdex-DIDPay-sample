import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';

const drawerWidth = 240;

export default function Root() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar component={Link} to={'/'}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DIDPay
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {['Verifiable Credentials', 'tbDex'].map((text, index) => (
            <ListItem
              key={text}
              component={Link}
              to={drawerLinkURL(text)}
              disablePadding
            >
              <ListItemButton>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

function drawerLinkURL(str: string): string {
  return str.replace(/\s/g, '');
}
