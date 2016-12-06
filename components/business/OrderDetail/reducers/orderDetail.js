import { ORDER_DETAIL_MODAL_SHOW, CHANGE_ORDER_TICKET } from '../actions/orderDetail';

const initialState = {
  orderDetail: {},
  show: false,
  orderTicketModal: {
    imgUrl: '',
    show: false
  }
}

export default function orderDetail(state = initialState, action) {
    let orderTicketModal = { ...state.orderTicketModal };

    switch (action.type) {
        case ORDER_DETAIL_MODAL_SHOW:
            return {...state,orderDetail:action.orderDetail,show:action.show};
        case CHANGE_ORDER_TICKET:
            orderTicketModal = {
              ...orderTicketModal,
              imgUrl: action.imgUrl,
              show: action.show
            }
            return {
              ...state,
              orderTicketModal
            }
        default:
            return state;
    }
}