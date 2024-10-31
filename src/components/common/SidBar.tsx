import React, { CSSProperties } from 'react'

import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import { Box, Toolbar } from '@mui/material';
import { NavLink } from 'react-router-dom';

interface SidBarProps {
  drawerWidth: number,
  mobileOpen: boolean,
  handleDrawerTransitionEnd: () => void,
  handleDrawerClose: () => void,
}

interface menuItem {
  text: string,
  path: string,
  icon: React.ComponentType
}

const baseLinkStyle: CSSProperties = {
  textDecoration: "none",
  color: "inherit",
  display: "block"
}

const activeLinkStyle: CSSProperties = {
  backgroundColor: "rgba(0, 0, 0, 0.08)"
}

const SidBar = ({drawerWidth, mobileOpen, handleDrawerTransitionEnd, handleDrawerClose}:SidBarProps) => {
  const MenuItems: menuItem[] = [
    {text: "Home", path: "/", icon: HomeIcon},
    {text: "Report", path: "/report", icon: EqualizerIcon},
  ]
  
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {MenuItems.map((item, index) => (
          <NavLink key={item.text} to={item.path} style={({isActive}) => {
            console.log("選択されたメニューは", item.text, isActive)
            return {
              ...baseLinkStyle,
              ...(isActive ? activeLinkStyle : {})
            }
          }}>
            <ListItem key={index} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          </NavLink>
        ))}
      </List>
     </div>
  );
  
  return (
          <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
          aria-label="mailbox folders"
        >
          {/* モバイル用 */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
  
          {/* PC用 */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
  
  )
}

export default SidBar