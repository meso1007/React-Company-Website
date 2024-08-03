export class User {
  //change info
  constructor(uid, fname, lname, email, role) {
    this.uid = uid;
    this.fname = fname;
    this.lname = lname;
    this.email = email;
    this.role = role;
  }
  displayInfo() {
    return JSON.stringify(this);
  }
}

export class Customer extends User {
  constructor(uid, fname, lname, email, role) {
    super(uid, fname, lname, email, role);
  }
}

export class Staff extends User {
  constructor(uid, fname, lname, email, role) {
    super(uid, fname, lname, email, role);
  }
}

export class Admin extends User {
  constructor(uid, fname, lname, email, role) {
    super(uid, fname, lname, email, role);
  }
}
