/* eslint-env browser */
import onChange from "on-change"

const watch = (elements, initialState) => {
  const { input, feedback, form } = elements
  const changeForm = (state) => {
    const {
      form: { error, valid },
    } = state

    if (valid) {
      input.classList.remove("is-invalid")
      feedback.textContent = ""
      form.reset()
    } else {
      input.classList.add("is-invalid")
      feedback.textContent = error
    }
  }

  const watchedObject = onChange(initialState, (path) => {
    switch (path) {
      case "form":
        changeForm(initialState)
        break
      default:
        break
    }
  })

  return watchedObject
}

export default watch
