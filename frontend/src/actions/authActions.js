import { resource } from './masterActions'

export const LOGIN_REQUESTED = "LOGIN_REQUESTED";
export const VERIFY_REQUESTED = "VERIFY_REQUESTED";
export const AUTHENTICATE_REQUESTED = "AUTHENTICATE_REQUESTED";
export const VERIFY_TICKET = "VERIFY_TICKET";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";

export const LOGIN_REQUEST_FAILED = "LOGIN_REQUEST_FAILED";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const VERIFY_REQUEST_FAILED = "VERIFY_REQUEST_FAILED";

export const GET_SERVICE = "GET_SERVICE";
export const SAVE_SERVICE = "SAVE_SERVICE";

export const SET_USER = "SET_USER"

export const getService = () => {
    return {
        type: GET_SERVICE
    };
}

export const loginRequest = () => {
    return ({
        type: LOGIN_REQUESTED
    });
}

export const authenticateRequest = () => {
    return ({
        type: AUTHENTICATE_REQUESTED
    });
}

export const verifyRequest = () => {
    return ({
        type: VERIFY_REQUESTED
    });
}

export const seenRecentUpdateRequest = () => {
    return ({
        type: SEEN_RECENT_UPDATE_REQUEST
    });
}

export const setUser = (user) => {
    return ({
        type: SET_USER,
        user
    })
}

/**
 * OLD SHIT
 */

export const sendTicket = (search) => {
  var equalSignIndex = search.indexOf('=') + 1;
  var ticket = search.substring(equalSignIndex,);

  console.log("Parsed Ticket: " + ticket);
    return (dispatch) => {
      resource('GET', 'auth'+'?ticket='+ticket).then(
        (result) => {

          if (result) {
            dispatch({
              type: "TICKET_APPROVED",
              netid: result.user.username,
              token: result.user.token
            })
            // Also set role
            dispatch(getUserInfo());
          }
          else {
            dispatch({
              type: "TICKET_DECLINED"
            })
          }
        }

      )

    }
}

/**
 * THIS ACTION IS VOID!!!!!
 * Sends ticket to backend and checks if user is approved
 * If it is approved/declined, change states on auth reducer accordingly
 * @param {*} ticket 
 */
export const ticketToBackend = (ticket) => {
  console.log("this is the ticket:" + ticket)
    return (dispatch) => {
      resource('GET', 'auth'+'?ticket='+ticket).then(
        (result) => {
          console.log("THIS IS THE RESULTS: " + result)
          if (result) {
            console.log("ticket is approved!!!")
            dispatch({
              type: "TICKET_APPROVED",
              netid: result.user.username,
              token: result.user.token
            })
          }
          else {
            console.log("ticket is declined!")
            dispatch({
              type: "TICKET_DECLINED"
            })
          }
          console.log("finished.")
        }

      )
    }
}

/*
  
*/
export const getUserInfo = () => {
  // Get Token from localStorage
  let token = localStorage.getItem('token');
  return (dispatch) => {
    // Call backend method for decoding & providing role
    resource('GET', 'activeUser/'+token).then(
      (userInfo) => {
        dispatch({
          type: "SET_USER_ROLE",
          role: userInfo.role
        })
        dispatch({
          type: "SET_USER_NETID",
          netid: userInfo.netid
        })
      }
    )
    .catch(
      (err) => {
        console.log(err);
      }
    )
  }
}