import axios from "axios"

export const translation = (text, target) => {
    axios.post("https://translation.googleapis.com/language/translate/v2", {
        params: {
            q: text,
            target,
            key: "AIzaSyAyRniSWIgVCvj30C2q7d9YlMnN06ZzT_M"
        }
    })
}