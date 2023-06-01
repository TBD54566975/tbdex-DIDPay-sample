import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { TruncatedTypography } from '../components/styled/TruncatedTypography';
import { Web5Context } from '../context/Web5Context';

const drawerWidth = 240;

export default function Root() {
  const { did } = useContext(Web5Context);

  const handleCopyDidClick = () => {
    if (did) {
      navigator.clipboard.writeText(did);
    }
  };

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
        <List sx={{ flexGrow: 1 }}>
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
        <Divider />
        <Box sx={{ p: 1 }}>
          <Typography variant="h6" color="text.secondary">
            Active Profile
          </Typography>
          <TruncatedTypography variant="body1" color="text.primary">
            {did}
          </TruncatedTypography>
          <Stack direction="row">
            <Button onClick={handleCopyDidClick}>Copy DID</Button>
            <Button component={Link} to={`/profile/${did}`}>
              View JSON
            </Button>
          </Stack>
        </Box>
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
