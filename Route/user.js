// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../Controller/user');

// Route to register a new user
router.post('/register', authController.register);

router.post('/', authController.login);


router.post("/tokenIsValid", async (req, res) => {
    try {
      const token = req.header("x-auth-token");
      if (!token) return res.json(false);
      const verified = jwt.verify(token, "passwordKey");
      if (!verified) return res.json(false);
  
      const user = await User.findById(verified.id);
      if (!user) return res.json(false);
      res.json(true);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });


module.exports = router;
