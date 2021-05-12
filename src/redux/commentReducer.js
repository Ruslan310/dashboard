import {
    CLOSE_APTEKS,
    SHOW_APTEKS,
    FETCH_APTEKS,
    APTEKS_RECEIVED,
    ENTER_APTEKA,
    ENTER_COMMENT,
    ENTER_TIME_ON,
    ENTER_TIME_OFF,
    ENTER_TARGET_APTEKA,
    SET_FILTER,
    RESET_FILTER,
    POST_COMMENT,
    POST_COMMENT_RECEIVED,
    LOG_IN_FAILED,
    SET_MODAL_MESSAGE,
    FETCH_REPORT,
    FETCH_REPORT_RECEIVED,
    REPORT_TIME_START,
    REPORT_TIME_END,
    WRITE_SELECT_TABLE_ROW,
    FETCH_CHANGE_REPORT,
    FETCH_CHANGE_REPORT_RECEIVED
} from "../redux/action";
let nowDate = new Date().toISOString().substr(0,10)
let message
const initialState = {
    getApteka: null,
    aptekaFiltered: null,
    showApteka: false,
    textApteka: '',
    textComment: null,
    enterTimeOn: null,
    enterTimeOff: null,
    postCommentDate: false,
    isLoader: false,
    modalMessage: '',
    error: null,
    tableReport: null,
    reportTimeStart: nowDate,
    reportTimeEnd: nowDate,
    selectTableComment:null,
    isChangeReport: null
}

export const commentReducer = (state = initialState, action) => {
    switch (action.type) {
        case REPORT_TIME_START:
            return {...state, reportTimeStart: action.value}
        case REPORT_TIME_END:
            return {...state, reportTimeEnd: action.value}
        case FETCH_APTEKS:
            return state
        case FETCH_REPORT:
            return {...state, isLoader:true}
        case FETCH_CHANGE_REPORT:
            return {...state, isLoader:true}
        case FETCH_CHANGE_REPORT_RECEIVED:
            if (action.data){
                message = 'Изменения внесены'
            } else {
                message = 'Не удалось внести изменения'
            }
            return {...state, isChangeReport: action.data, modalMessage: message, isLoader:false}
        case APTEKS_RECEIVED:
            return {...state, getApteka: action.data, aptekaFiltered: action.data}
        case FETCH_REPORT_RECEIVED:
            if (action.data.length<1) {
                message = 'нет записей в талице'
            } else {message = ''}
            return {...state, tableReport: action.data, isLoader:false, modalMessage: message}
        case LOG_IN_FAILED:
            return {...state, error: action.data,modalMessage: 'Нет связи с сервером', isLoader:false}
        case POST_COMMENT:
            return {...state, isLoader:true}
        case POST_COMMENT_RECEIVED:
            if (action.data){
                message = 'Коментарий успешно записан'
            } else {
                message = 'Коментарий неудалось записать'
            }
            return {...state, postCommentDate: action.data, isLoader:false, modalMessage: message}
        case CLOSE_APTEKS:
            return {...state, showApteka: false}
        case SHOW_APTEKS:
            return {...state, showApteka: true}
        case ENTER_APTEKA:
            return {...state, showApteka: action.value}
        case ENTER_COMMENT:
            return {...state, textComment: action.value}
        case ENTER_TIME_ON:
            return {...state, enterTimeOn: action.value}
        case ENTER_TIME_OFF:
            return {...state, enterTimeOff: action.value}
        case ENTER_TARGET_APTEKA:
            return {...state, textApteka: action.value}
        case SET_FILTER:
            let stText = action.value
            let stOnline = state.getApteka.slice()

            for (let i = 0; i < stOnline.length; i++) {
                let result = false
                stOnline[i].isFilter = false
                    if (stOnline[i].apteka.toLowerCase().includes(stText.toLowerCase())) {
                        result = true
                    }
                if (result) {
                    stOnline[i].isFilter = true
                }
            }
            return {...state, aptekaFiltered: stOnline}
        case RESET_FILTER:
            let filtrlist = state.apteka.slice()
            for (let i = 0; i < filtrlist.length; i++) {
                filtrlist[i].isFilter = true
            }
            return {...state, aptekaFiltered: filtrlist}

        case SET_MODAL_MESSAGE:
            return {...state, modalMessage: action.message}
            case WRITE_SELECT_TABLE_ROW:
            return {...state, selectTableComment: action.value}
        default:
            return state
    }
}