import { call, put, takeLatest } from "redux-saga/effects";
import { callAPI } from ".";
import { actions } from "../actions";
import { fetchMessage, fetchMessageFailed, fetchMessageSuccess, updateMsgToPlay } from "../store/chat";
import { API_HOST } from "../utils/constants";

export function* fetchMessageSaga(action) {
  try {
    yield put(fetchMessage(action.payload));
    let result = yield call(() =>
      callAPI({ url: `${API_HOST}/chat`, method: "POST", data: { message: action.payload } })
    );        
    yield put(updateMsgToPlay(result.data.message));
    yield put(fetchMessageSuccess(result.data.message));
  } catch (err) {
    yield put(fetchMessageFailed(err.response?.data?.error?.message ?? "Failed to fetch message."));
  }
}

export function* fetchMessageWatcher() {
  yield takeLatest(actions.chat.FETCH_MESSAGE, fetchMessageSaga);
}
