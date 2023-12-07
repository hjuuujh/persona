import React from 'react';
import { observer } from 'mobx-react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import LoginForm from './LoginForm';
// https://5xjin.github.io/blog/react_jwt_router/ stored token
function LoginPage() {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div style={{backgroundColor:"black"}}>
      <Box style={{backgroundColor:"whtie", marginLeft:2+"%", marginRight:2+"%"}}
        position={'relative'}
        minHeight={'calc(100vh - 247px)'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        height={1}
      >
          <Grid style={{backgroundColor:"white"}} container>
            <Grid 
              item
              container
              alignItems={'center'}
              justifyContent={'center'}
            >
              <LoginForm />
            </Grid>
          </Grid>
      </Box>
    </div>
  )
}

export default observer(LoginPage);