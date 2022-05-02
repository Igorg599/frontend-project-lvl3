/* eslint-env browser */
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import { object, string, number, date, InferType } from "yup"
import onChange from "on-change"

const form = document.querySelector("form")
const input = document.querySelector(".form-control")

let userSchema = object({
  website: string().url().nullable(),
})

const initialState = {
  streams: [],
  error: null,
}

const watchedObject = onChange(
  initialState,
  function (path, value, previousValue, applyData) {
    watchedObject.error
      ? input.classList.add("is-invalid")
      : input.classList.remove("is-invalid")
  }
)

form.addEventListener("submit", (e) => {
  e.preventDefault()
  const formData = new FormData(e.target)
  userSchema
    .validate({
      website: formData.get("url"),
    })
    .then((res) => {
      if (watchedObject.streams.includes(res.website)) {
        watchedObject.error = "error"
        return
      }
      watchedObject.streams = [...watchedObject.streams, res.website]
      watchedObject.error = null
      form.reset()
    })
    .catch((err) => {
      watchedObject.error = "error"
    })
})
