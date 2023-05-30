import { all } from "redux-saga/effects";
import Axios from "axios";
import { fetchMessageWatcher } from "./chat";

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_API_KEY,
});
delete configuration.baseOptions.headers["User-Agent"];

const openai = new OpenAIApi(configuration);

export let callAPI = async ({ url, method, data }) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    // model: "gpt-3.5-turbo",
    // n: 1,
    // stop: '\n',
    prompt: `${data.message}`,
    temperature: 0.7,
    max_tokens: 128,
  });

  let rlt = response.data.choices[0].text;
  let pos = rlt.lastIndexOf("。");
  if (pos > 0) rlt = rlt.substring(0, pos + 1);

  pos = rlt.indexOf("。");
  if (pos === 0) {
    rlt = rlt.substring(1, rlt.length);
  }
  return { data: { message: rlt } };
};

export default function* rootSaga() {
  yield all([fetchMessageWatcher()]);
}