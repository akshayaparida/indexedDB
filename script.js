// Create needed constants
const list = document.querySelector('ul');
const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');
const form = document.querySelector('form');
const submitBtn = document.querySelector('form button');

// Create an instance of a db object for us to store the open database in
let db;

// Open our database; it is created if it doesn't already exist
// (see the upgradeneeded handler below)
const openRequest = window.indexedDB.open("notes_db", 1);


// error handler signifies that the database didn't open successfully
openRequest.addEventListener("error", () =>
    console.error("Database failed to open"),
  );
  
  // success handler signifies that the database opened successfully
  openRequest.addEventListener("success", () => {
    console.log("Database opened successfully");
  
    // Store the opened database object in the db variable. This is used a lot below
    db = openRequest.result;
  
    // Run the displayData() function to display the notes already in the IDB
    displayData();
  });

  
  // Set up the database tables if this has not already been done
openRequest.addEventListener("upgradeneeded", (e) => {
    // Grab a reference to the opened database
    db = e.target.result;
  
    // Create an objectStore in our database to store notes and an auto-incrementing key
    // An objectStore is similar to a 'table' in a relational database
    const objectStore = db.createObjectStore("notes_os", {
      keyPath: "id",
      autoIncrement: true,
    });
  
    // Define what data items the objectStore will contain
    objectStore.createIndex("title", "title", { unique: false });
    objectStore.createIndex("body", "body", { unique: false });
  
    console.log("Database setup complete");
  });
  

  // Create a submit event handler so that when the form is submitted the addData() function is run
form.addEventListener("submit", addData);

// Define the addData() function
function addData(e) {
  // prevent default - we don't want the form to submit in the conventional way
  e.preventDefault();

  // grab the values entered into the form fields and store them in an object ready for being inserted into the DB
  const newItem = { title: titleInput.value, body: bodyInput.value };

  // open a read/write db transaction, ready for adding the data
  const transaction = db.transaction(["notes_os"], "readwrite");

  // call an object store that's already been added to the database
  const objectStore = transaction.objectStore("notes_os");

  // Make a request to add our newItem object to the object store
  const addRequest = objectStore.add(newItem);

  addRequest.addEventListener("success", () => {
    // Clear the form, ready for adding the next entry
    titleInput.value = "";
    bodyInput.value = "";
  });

  // Report on the success of the transaction completing, when everything is done
  transaction.addEventListener("complete", () => {
    console.log("Transaction completed: database modification finished.");

    // update the display of data to show the newly added item, by running displayData() again.
    displayData();
  });

  transaction.addEventListener("error", () =>
    console.log("Transaction not opened due to error"),
  );
}
