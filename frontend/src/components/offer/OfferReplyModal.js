import React, { useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OfferStore from '../../store/OfferStore';
import { observer } from 'mobx-react';
import { ButtonGroup } from '@mui/material';

function OfferReplyModal() {
  const [reply, setReply] = useState();
  const [accept, setAccept] = useState();
  const [decline, setDecline] = useState();
  

  const handleSubmit = () => {
    let status
    if(accept==="contained"){
      status=1;
    }else{
      status=-1
    }
    const data = {
      id:OfferStore.offer.id,
      reply:reply,
      status:status
    }

    console.log(data);

    OfferStore.replyOffer(data);
  }

  return (
    <div>
      <Dialog open={OfferStore.replyOpen} onClose={() => OfferStore.setReplyModal(false)}>
        <DialogTitle>{OfferStore.offer.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Message
          </DialogContentText>

          {OfferStore.offer.status===0 && 
          <>
          <DialogTitle>
            {OfferStore.offer.message}
          </DialogTitle>
          <ButtonGroup>
            <Button variant={accept}
              color="primary"
              size="small" 
              onClick={()=>{setAccept(accept==="contained"?"outlined":"contained")
              setDecline(decline==="outlined"?"contained":"outlined")}}>Accept</Button>
            <Button variant={decline}
              color="primary"
              size="small"
              onClick={()=>{setAccept(accept==="outlined"?"contained":"outlined")
              setDecline(decline==="contained"?"outlined":"contained")}}>Decline</Button>
          </ButtonGroup>
          <DialogContentText>
            Reply
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="reply"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setReply(e.target.value)}
          />
          <DialogActions>
          <Button onClick={() => OfferStore.setReplyModal(false)}>Cancel</Button>
          <Button onClick={() => { handleSubmit(); OfferStore.setReplyModal(false) }}>Send</Button>
        </DialogActions>
           </>}

          {OfferStore.offer.status===1 && 
          <>
          <DialogTitle>
            {OfferStore.offer.message}
          </DialogTitle>
          <ButtonGroup>
            <Button variant="contained"
              color="primary"
              size="small">Accept</Button>
            <Button variant="outlined"
              color="primary"
              size="small">Decline</Button>
          </ButtonGroup>
          <DialogContentText>
            Reply
          </DialogContentText>
          <DialogTitle>
            {OfferStore.offer.reply}
          </DialogTitle>
          <DialogActions>
          <Button onClick={() => {  OfferStore.setReplyModal(false) }}>OK</Button>
        </DialogActions>
           </>}

          {OfferStore.offer.status===-1 && 
          <>
          <DialogTitle>
            {OfferStore.offer.message}
          </DialogTitle>
          <ButtonGroup>
            <Button variant="outlined"
              color="primary"
              size="small">Accept</Button>
            <Button variant="contained"
              color="primary"
              size="small">Decline</Button>
          </ButtonGroup>
          <DialogContentText>
            Reply
          </DialogContentText>
          <DialogTitle>
            {OfferStore.offer.reply}
          </DialogTitle>
          <DialogActions>
          <Button onClick={() => { OfferStore.setReplyModal(false) }}>OK</Button>
        </DialogActions>
          </>}
        </DialogContent>
        
      </Dialog>
    </div>
  )
}

export default observer(OfferReplyModal)