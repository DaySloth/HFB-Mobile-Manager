import axios from "axios";

export default async (req, res) => {
  const {
    query: { handler },
  } = req;

  switch (handler[0]) {
    case "create":
      axios
        .post("https://hfb-api.herokuapp.com/api/users/create", req.body, {
          headers: {
            "hfb-apikey": "S29obGVyUm9ja3Mh",
          },
        })
        .then(({ status }) => {
          if (status === 200) {
            res.json({ status: 200, message: "Successfully created user" });
            res.end();
          } else {
            res.json({ status: 400, message: "Error in adding user" });
            res.end();
          }
        })
        .catch(({ response }) => {
          if (response.status === 409) {
            res.json({ status: 400, message: "Users Already Exists" });
            res.end();
          } else {
            res.json({ status: 400, message: "Error in adding user" });
            res.end();
          }
        });

      break;
    case "update":
      //update user
      break;
    case "delete":
      //delete user
      break;

    default:
      console.log("hitting default");
  }
};
