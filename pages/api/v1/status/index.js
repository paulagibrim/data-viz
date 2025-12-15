function status(request, response) {
  response.status(200).json({ chave: "Um status funcionando, né?!" });
}

export default status;
