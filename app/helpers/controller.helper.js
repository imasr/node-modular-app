module.exports.controllerFunction = (func, res, param1, param2 = null) => {
  return func(param1, param2)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(e => {
      return res.status(400).send(e);
    });
};