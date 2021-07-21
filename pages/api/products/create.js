import React from "react";
import axios from "axios";

export default async (req, res) => {
  axios
    .post("http://localhost:3001/api/products/create", req.body, {
      headers: {
        "hfb-apikey": "S29obGVyUm9ja3Mh",
        "Accept": "*/*",
      },
    })
    .then((result) => {
      console.log(result);
    });
};
