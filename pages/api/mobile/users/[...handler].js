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
          console.log(status);
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
      const updateUsername =
        req.body.first_name.toLowerCase() + req.body.last_name.toLowerCase();
      if (req.body.password) {
        req.body.password = Base64.encode(req.body.password);
      }
      if (req.body.oldUsername) {
        let oldUsername = req.body.oldUsername;
        delete req.body.oldUsername;

        db.ref(`/users/${oldUsername}`)
          .remove()
          .then((result) => {
            db.ref(`/users/${updateUsername}`)
              .set(req.body)
              .then((result) => {
                res.json({ status: 200, message: "Successfully updated user" });
                res.end();
              });
          });
      } else {
        db.ref(`/users/${updateUsername}`)
          .update(req.body)
          .then((result) => {
            res.json({ status: 200, message: "Successfully updated user" });
            res.end();
          });
      }
      break;
    case "delete":
      db.ref(`/users/${handler[1]}`)
        .remove()
        .then((result) => {
          res.json({ status: 200, message: "Successfully deleted user" });
          res.end();
        });
      break;

    default:
      console.log("hitting default");
  }
};
