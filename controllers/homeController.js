exports.getHomePage = (req, res) => {
    res.render('home', {
      title: 'Welcome to My Node.js Portfolio',
      introduction: 'Hello! This is a portfolio showcasing my projects built with Node.js and Express.'
    });
  };