import React from 'react'
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import OfferStore from '../../store/OfferStore';
import OfferModal from './OfferModal';
import OfferReplyModal from './OfferReplyModal';
import { observer } from 'mobx-react';

function MyOfferList({offers, flag}) {
  const theme = useTheme();
  // const active = { color: '#d5a869' };

  const handleDelete = (offer, type) => {
    if (window.confirm('삭제하시겠습니까?') === true) {
      OfferStore.deleteOffer(offer.id, type);
    }
  }

  return (
    <Box>
      <Grid
        container
        sx={{
          background: theme.palette.background.paper,
          borderRadius: 2,
        }}
      >
        {flag ? offers?.map((item, i) => (
          <Grid
            item
            xs={12}
            key={i}
            sx={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              '&:last-child': {
                borderBottom: 0,
              },
            }}
          >
            <Box padding={2} display={'flex'} alignItems={'center'}>
              <Box
                display={'flex'}
                flexDirection={{ xs: 'column', sm: 'row' }}
                flex={'1 1 100%'}
                justifyContent={{ sm: 'space-between' }}
                alignItems={{ sm: 'center' }}
              >
                <Box marginBottom={{ xs: 1, sm: 0 }}>
                  <Typography variant={'subtitle1'} fontWeight={700}>
                    {item.message}
                  </Typography>
                  <Typography color={'text.secondary'}>
                    {item.name}
                  </Typography>
                </Box>
                <Typography color={'text.secondary'}>
                  {`${item.company} / ${item.location}`}
                </Typography>
              </Box>
              <Box marginLeft={2}>
                {item.status !==0 && <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => {
                    OfferStore.setOffer(item);
                    OfferStore.setModal(true);
                  }}
                  endIcon={
                    <Box
                      component={'svg'}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      width={12}
                      height={12}
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </Box>
                  }
                >
                  show the reply
                </Button>}
              
                
                {item.status ===0 && <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => {
                    OfferStore.setOffer(item);
                    OfferStore.setModal(true);
                  }}
                  endIcon={
                    <Box
                      component={'svg'}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      width={12}
                      height={12}
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </Box>
                  }
                >
                  Update the Message
                </Button>}
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => handleDelete(item, "offer")}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Grid>
        ))

        : offers?.map((item, i) => (
          <Grid
            item
            xs={12}
            key={i}
            sx={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              '&:last-child': {
                borderBottom: 0,
              },
            }}
          >
            <Box padding={2} display={'flex'} alignItems={'center'}>
              <Box
                display={'flex'}
                flexDirection={{ xs: 'column', sm: 'row' }}
                flex={'1 1 100%'}
                justifyContent={{ sm: 'space-between' }}
                alignItems={{ sm: 'center' }}
              >
                <Box marginBottom={{ xs: 1, sm: 0 }}>
                  <Typography variant={'subtitle1'} fontWeight={700}>
                    {item.message}
                  </Typography>
                  <Typography color={'text.secondary'}>
                    {item.name}
                  </Typography>
                </Box>
                <Typography color={'text.secondary'}>
                  {`${item.company} / ${item.location}`}
                </Typography>
              </Box>
              <Box marginLeft={2}>
                

                {(item.status === 1 || item.status === -1) && <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => {
                    OfferStore.setOffer(item);
                    OfferStore.setReplyModal(true);
                  }}
                  endIcon={
                    <Box
                      component={'svg'}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      width={12}
                      height={12}
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </Box>
                  }
                >
                  Show the Reply
                </Button>}

                {item.status === 0 && <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => {
                    OfferStore.setOffer(item);
                    OfferStore.setReplyModal(true);
                  }}
                  endIcon={
                    <Box
                      component={'svg'}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      width={12}
                      height={12}
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </Box>
                  }
                >
                  Write the Reply
                </Button>}
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => handleDelete(item, "offered")}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
      <OfferReplyModal />
      <OfferModal />
    </Box>
  )
}

export default observer(MyOfferList)