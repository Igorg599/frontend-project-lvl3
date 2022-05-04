/* eslint-env browser */
import axios from "axios"
import onChange from "on-change"
import parser from "./parser.js"

const input = document.querySelector(".form-control")

const initialState = {
  streams: [],
  error: false,
}

const watchedObject = onChange(initialState, () => {
  if (watchedObject.error) {
    input.classList.add("is-invalid")
  } else {
    input.classList.remove("is-invalid")
  }

  if (watchedObject.streams.length > 0) {
    axios
      .get(
        `https://allorigins.hexlet.app/get?disableCache=true&url=${watchedObject.streams[0]}`
      )
      .then((response) => {
        if (response.status === 200) return response.data
        throw new Error("Network response was not ok.")
      })
      .then((data) => parser(data.contents))
      .catch((err) => console.log(err))
  }
})

export default watchedObject
