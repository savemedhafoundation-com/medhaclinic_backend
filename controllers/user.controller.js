

exports.getUsers = (req, res) => {
  res.json({
    success: true,
    users: []
  });
};

exports.createUser = (req, res) => {
  const { name, email } = req.body;

  res.status(201).json({
    success: true,
    message: 'User created',
    data: { name, email }
  });
};
