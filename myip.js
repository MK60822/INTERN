// Using fetch to get your public IP
fetch('https://api.ipify.org?format=json')
  .then(response => response.json())
  .then(data => {
    console.log("Your IP Address is:", data.ip);
  })
  .catch(error => {
    console.error("Error fetching IP:", error);
  });