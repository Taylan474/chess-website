import React, { useContext } from "react";
import Snackbar from "@mui/material/Snackbar";
import { GameContext } from "../../context/chessGameContext";
import { types } from "../../context/chessActions";

const Toast = () => {
    const { message, dispatch } = useContext(GameContext);

    const handleClose = () => {
        dispatch({ type: types.CLEAR_MESSAGE });
    };
    return (
        <Snackbar
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            open={!!message}                        //only open when message not empty
            autoHideDuration={2500}
            onClose={handleClose}
            onExited={handleClose}
            ContentProps={{
                "aria-describedby": "message-id",
            }}
            message={message}
        />
    );
};
export default Toast;