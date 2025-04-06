function checkEmployeeOrAdmin(req, res, next) {
    const account = res.locals.accountData
  
    if (!account) {
      req.flash("notice", "You must be logged in to access this area.")
      return res.redirect("/account/login")
    }
  
    if (account.account_type === "Admin" || account.account_type === "Employee") {
      return next()
    }
  
    req.flash("notice", "Access denied. Admin or Employee privileges required.")
    return res.redirect("/account/login")
  }
  
  module.exports = { checkEmployeeOrAdmin }
  