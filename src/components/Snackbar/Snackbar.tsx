import { Snackbar, SnackbarCloseReason } from "@material-ui/core";
import useStyles from "./styles";
import MuiAlert from "@material-ui/lab/Alert";
import { SyntheticEvent } from "react";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const CustomizedSnackbar: React.FC<Props> = ({ open, setOpen }) => {
  const classes = useStyles();

  const handleClose = (
    event: SyntheticEvent<any, Event>,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") return;

    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <MuiAlert
          onClose={handleClose}
          severity={"success"}
          elevation={6}
          variant="filled"
        >
          Transaction successfully created.
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default CustomizedSnackbar;
