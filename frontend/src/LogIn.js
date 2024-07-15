import React, { useState } from "react";

function LogIn() {
  const password = "swordfish";
  const [authorized, setAuthorized] = useState(false);

  function handleSubmit(e) {
    const enteredPassword = e.target.querySelector(
      'input[type="password"]'
    ).value;
    const auth = enteredPassword === password;
    setAuthorized(auth);
  }

  const login = (
    <form action="#" onSubmit={handleSubmit}>
      <input type="password" placeholder="Password"></input>
      <input type="submit"></input>
    </form>
  );

  const contactInfo = (
    <ul>
      <li>client@example.com</li>
      <li>555.555.5555</li>
    </ul>
  );

  return (
    <div id="authorization">
      <h1>{authorized === true ? "Contact" : "Enter the password"}</h1>
      {authorized === true ? contactInfo : login}
    </div>
  );
}

export default LogIn;