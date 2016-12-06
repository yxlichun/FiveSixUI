import S from '../service';

export const ORDER_DETAIL_MODAL_SHOW = 'ORDER_DETAIL_MODAL_SHOW';
export const NOTIF_SEND = 'NOTIF_SEND';
export const NOTIF_DISMISS = 'NOTIF_DISMISS';
export const NOTIF_CLEAR = 'NOTIF_CLEAR';
export const CHANGE_ORDER_TICKET = 'CHANGE_ORDER_TICKET';

export function showOrderDetail(orderid) {
  return (dispatch, getState) => {
      dispatch(S.fetch_order_detail({orderid:orderid})).then(ret => {
          if (!ret.type.match(/ERROR_RCV/)) {
              dispatch({type:ORDER_DETAIL_MODAL_SHOW,orderDetail:ret.payload.data,show:true});
          }
      });
  };
}

export function closeOrderDetail() {
  return { type:ORDER_DETAIL_MODAL_SHOW,orderDetail:{},show:false };
}

export function getOrderTicket(orderid) {
    return (dispatch, getState) => {
      dispatch(S.get_order_ticket({
          qt: 'getticketpic',
          orderid:orderid
        })).then(ret => {
          if (!ret.type.match(/ERROR_RCV/)) {
              dispatch(changeOrderTicket(ret.payload.data.filename, true));
          }
      });
  };
}

export function changeOrderTicket(imgUrl, show = true) {
    return { type: CHANGE_ORDER_TICKET, imgUrl, show }
}
