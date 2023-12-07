import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import { removeCookie, getCookie } from '../../utils/cookie';


function Header() {
  const active = { color: '#d5a869' };
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const token = getCookie('ACCESS_TOKEN');

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const handleProfile = () => {
    navigate('/mypage');
    setOpen(false);
  };
  const handleLogout = (event) => {
    removeCookie('name');
    removeCookie('id');
    removeCookie('ACCESS_TOKEN');
    localStorage.clear();
    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <header>
      <Stack direction="row" spacing={2}>
        <div className='inner'>
          <ul id='gnb'>
            <div className='logo'>
              <li>
                <NavLink activestyle={active} to='/'>
                  <h1>Persona</h1>
                </NavLink>
              </li>
            </div>
            <div className='menu'>
              <Button
                id='menuButton'
                ref={anchorRef}
                aria-controls={open ? 'composition-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
              >
                <h1> Menu</h1>
              </Button>
              <li id='actor'>
              
                <Popper
                  open={open}
                  anchorEl={anchorRef.current}
                  role={undefined}
                  placement="bottom-start"
                  transition
                  disablePortal

                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}

                    >
                      <Paper >
                        <ClickAwayListener onClickAway={handleClose}>
                          <MenuList
                            autoFocusItem={open}
                            onKeyDown={handleListKeyDown}
                            >
                            {token ?
                            <div><MenuItem id='menuItem' onClick={handleProfile}>My Page</MenuItem>
                            <MenuItem id='menuItem' onClick={handleLogout}>Logout</MenuItem></div>
                          :
                          <div><MenuItem id='menuItem' onClick={()=>{navigate('/signup');setOpen(false)}}>SignUp</MenuItem>
                          <MenuItem id='menuItem' onClick={()=>{navigate('/login');setOpen(false)}}>Login</MenuItem></div>}
                        </MenuList>
                        </ClickAwayListener>
                      </Paper>

                    </Grow>
                  )}
                </Popper>
               
              </li>
            </div>
            

            
          </ul>
        </div>
      </Stack>

    </header>
  );
}
export default Header;
