id
first
last
email - put unique constrain on the email
hashPassword (which should first be hashed)
created_at

//we can put the second table in the first sql file

//petition part3


login: two inp fields - email, passw
redirect them to petition page

logout: delete everything in the user cookies:
req.session = null
logout can happen on GET or POST request

if a user is not loged in they should not be alowed to see any page other than registration or login
if he hasen't signed petition yet - he should't be able to see thank you page
