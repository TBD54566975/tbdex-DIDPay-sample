import React from 'react';
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
import { useWeb5Context } from '../context/Web5Context';

const drawerWidth = 240;

export default function Root() {
  const { profile, web5 } = useWeb5Context();
  const did = profile.did.id;

  const handleCopyDidClick = () => {
    if (did) {
      navigator.clipboard.writeText(did);
    }
  };

  const handleWipeState = async () => {
    // doesnt work for some reason
    web5.appStorage.clear();

    // hack instead
    await manuallyClearState();
  };

  const manuallyClearState = async () => {
    const localDBs = await window.indexedDB.databases();

    for (const local of localDBs) {
      window.indexedDB.deleteDatabase(local.name!);
    }

    document.location.reload();
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
          {['Verifiable Credentials', 'Offerings', 'Quotes', 'Orders'].map(
            (text, index) => (
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
            )
          )}
        </List>
        <Divider />
        <Box sx={{ p: 1 }}>
          <Typography variant="h6" color="text.secondary">
            Active Profile
          </Typography>
          <TruncatedTypography variant="body1" color="text.primary">
            {did}
          </TruncatedTypography>
          <Stack direction="column">
            <Button onClick={handleCopyDidClick}>Copy DID</Button>
            <Button component={Link} to={`/profile`}>
              View JSON
            </Button>
            <Button onClick={handleWipeState}>Wipe State</Button>
          </Stack>
        </Box>
      </Drawer>
      <Box overflow="auto" sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

function drawerLinkURL(str: string): string {
  return str.replace(/\s/g, '');
}
