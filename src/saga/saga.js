import {
    FETCH_APTEKS,
    APTEKS_RECEIVED,
    POST_COMMENT,
    POST_COMMENT_RECEIVED,
    LOG_IN_FAILED,
    FETCH_REPORT,
    FETCH_REPORT_RECEIVED,
    FETCH_CHANGE_REPORT,
    FETCH_CHANGE_REPORT_RECEIVED,
    localUpdateStoreRow
} from "../redux/action";

import {put, takeLatest, all} from 'redux-saga/effects';

const format = (dateString) => {
    if (dateString) {
        let time = dateString.split('T')[1].substring(0, 5)
        let arrDate = dateString.split('T')[0].split('-')
        let date = `${arrDate[2]}.${arrDate[1]}.${arrDate[0]}`
        return {date, time}
    }
    return null
}

/**saga getApteka */
function* fetchApteks() {
    let data = yield fetch(process.env.REACT_APP_SAGA_GET_DATE_APTEKS)
        .then(response => response.json());

    let newList = []
    data.map(item => {
        let parsed = {}
        parsed.idApteka = item.ID_APTEKA
        parsed.apteka = item.APTEKA
        parsed.apteka_date_open = format(item.apteka_date_open)?.date
        parsed.phone = item.Phone
        parsed.town = item.TownRu
        parsed.days1 = item.days1
        parsed.days2 = item.days2
        parsed.isFilter = true
        newList.push(parsed)
    })
    yield put({type: APTEKS_RECEIVED, data: newList});
}

function* fetchApteksWatcher() {
    yield takeLatest(FETCH_APTEKS, fetchApteks)
}


/** saga postComment */
function* postComment(action) {
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.value)
    }
    console.log('saga', action.value)
    let nowDate = new Date().toISOString().substr(0, 10)
    let newDate = {
        dateStart: nowDate,
        dateEnd: nowDate
    }
    try {
        const data = yield fetch(process.env.REACT_APP_SAGA_INPUT_COMMENT, options)
            .then(response => response.json());
        yield put({type: POST_COMMENT_RECEIVED, data: data});
        yield put({type: FETCH_REPORT, value: newDate});
    } catch (error) {
        yield put({type: LOG_IN_FAILED, data: error.toString()});
    }
}

function* postCommentWatcher() {
    yield takeLatest(POST_COMMENT, postComment)
}

/**saga getReport */
function* fetchReport(action) {
    let options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.value)
    }
    try {
        let data = yield fetch(process.env.REACT_APP_SAGA_FETCH_REPORT, options)
            .then(response => response.json());

        const formatGrafik = (dateString) => {
            if (!dateString) {
                return '-'
            }
            let day1 = dateString.split('-')[0].substring(0, 5)
            let day2 = dateString.split('-')[1].substring(1, 6)
            if (day2 === '23:59') {
                return "круглосуточная"
            }
            if (day2 === '00:00') {
                return "нет графика"
            }
            return `${day1}-${day2}`
        }
        let newList = []
        data.map(item => {
            let parsed = {}
            parsed.apteka = item.apteka
            parsed.diff = item.diff
            parsed.dt_date = format(item.dt_date)?.date
            parsed.date = item.dt_date.substring(0, 10)
            parsed.grafik = formatGrafik(item.grafik)
            parsed.dt_end = format(item.dt_end)?.time
            parsed.dt_begin = format(item.dt_begin)?.time
            parsed.comment = item?.comment
            parsed.id = item.id
            newList.push(parsed)
        })
        console.log(newList)
        yield put({type: FETCH_REPORT_RECEIVED, data: newList});
    } catch (error) {
        yield put({type: LOG_IN_FAILED, data: error.toString()});
    }
}

function* fetchReportWatcher() {
    yield takeLatest(FETCH_REPORT, fetchReport)
}

/**saga changeReport */
function* fetchPutReport(action) {
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.value)
    }
    try {
        let data = yield fetch(process.env.REACT_APP_SAGA_PUT_REPORT, options)
            .then(response => response.json());
        yield put({type: FETCH_CHANGE_REPORT_RECEIVED, data: data});
        yield put(localUpdateStoreRow(Object.assign(action.value, {isChange: data})))
    } catch (error) {
        yield put({type: LOG_IN_FAILED, data: error.toString()});
    }
}

function* fetchPutReportWatcher() {
    yield takeLatest(FETCH_CHANGE_REPORT, fetchPutReport)
}

export default function* rootSaga() {
    yield all([
        fetchApteksWatcher(), postCommentWatcher(), fetchReportWatcher(), fetchPutReportWatcher()
    ])
}
  