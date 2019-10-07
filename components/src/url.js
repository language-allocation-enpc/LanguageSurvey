const PROD = true;

let url = "";
if (PROD) {
  url = "https://language-survey-api.herokuapp.com/";
} else {
  url = "https://localhost:5000/";
}

export default url;
