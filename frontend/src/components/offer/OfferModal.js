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
import { getCookie } from '../../utils/cookie';

function OfferModal() {
  const [message, setMessage] = useState(OfferStore.offer.message);
  const id = getCookie('id');


  const handleSubmit = () => {
    if (OfferStore.offer.message) {
      const data = {
        id: OfferStore.offer.id,
        message: message
      }
      OfferStore.updateOffer(data);
    } else {
      const data = {
        offerId: id,
        offeredId: OfferStore.video.userId,
        message: message
      }
      OfferStore.createOffer(data).then((re) => {
        if (re.error === "이미 오퍼를 보낸 사용자입니다") {
          return alert(re.error);
        }
      });
    }

  }
  function isEmptyObject(param) {
    if (Object.keys(param).length === 0){
      return true;

    }
    else{
      return false;
    }
  }
  return (
    <div>
      <Dialog open={OfferStore.open} onClose={() => OfferStore.setModal(false)}>
        <DialogTitle>{OfferStore.offer.name}{OfferStore.video.userName}</DialogTitle>

        {isEmptyObject(OfferStore.offer) ?
          <>
            <DialogContent>
              <DialogContentText>
                Offer
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Message"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) => setMessage(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => OfferStore.setModal(false)}>Cancel</Button>
              <Button onClick={() => { handleSubmit(); OfferStore.setModal(false) }}>Send</Button>
            </DialogActions>
          </>
          : <>
            {OfferStore.offer.status === 0 && <>
              <DialogContent>
                <DialogContentText>
                  {OfferStore.offer.message}
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Message"
                  type="text"
                  fullWidth
                  variant="standard"
                  onChange={(e) => setMessage(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => OfferStore.setModal(false)}>Cancel</Button>
                <Button onClick={() => { handleSubmit(); OfferStore.setModal(false) }}>Send</Button>
              </DialogActions>
            </>}

            {OfferStore.offer.status === 1 && <>
              <DialogContent>
                <DialogContentText>
                  Result
                </DialogContentText>
                <DialogTitle>
                  Accept
                </DialogTitle>
                <DialogContentText>
                  Message
                </DialogContentText>
                <DialogTitle>
                  {OfferStore.offer.message}
                </DialogTitle>
                <DialogContentText>
                  Reply
                </DialogContentText>
                <DialogTitle>
                  {OfferStore.offer.reply}
                </DialogTitle>
                <DialogContentText>
                  Email
                </DialogContentText>
                <DialogTitle>
                  {OfferStore.offer.email}
                </DialogTitle>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => OfferStore.setModal(false)}>Cancel</Button>
              </DialogActions>
            </>}

            {OfferStore.offer.status === -1 && <>
              <DialogContent>
                <DialogContentText>
                  Result
                </DialogContentText>
                <DialogTitle>
                  Decline
                </DialogTitle>
                <DialogContentText>
                  Message
                </DialogContentText>
                <DialogTitle>
                  {OfferStore.offer.message}
                </DialogTitle>
                <DialogContentText>
                  Reply
                </DialogContentText>
                <DialogTitle>
                  {OfferStore.offer.reply}
                </DialogTitle>

              </DialogContent>
              <DialogActions>
                <Button onClick={() => OfferStore.setModal(false)}>Cancel</Button>
              </DialogActions>
            </>}
          </>}


      </Dialog>
    </div>
  );
}

export default observer(OfferModal);
