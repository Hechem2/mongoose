const mongoose = require("mongoose");
require("dotenv").config();


const connectDB = async () => {
  console.log(`MongoDB URL: ${process.env.MONGO_URI}`);
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};


const run = async () => {
  await connectDB();

 
  const personSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: Number,
    favoriteFoods: [String],
  });

  const Person = mongoose.model("Person", personSchema);


  console.log("-")
  console.log("Initial Database state : ", (await Person.find()).length)
  await Person.deleteMany();
  console.log("Reset Database state : ", (await Person.find()).length)
  console.log("We can start now")
  console.log("-")

  try {
    const newPerson = new Person({
      name: "John Doe",
      age: 30,
      favoriteFoods: ["Spaghetti", "hamburger"],
    });

    const savedPerson = await newPerson.save();
    console.log("New person saved:", savedPerson);

    const arrayOfPeople = [
      { name: "Alice", age: 25, favoriteFoods: ["Pizza", "Libannais"] },
      { name: "Bob", age: 28, favoriteFoods: ["Hachée", "César"] },
    ];

    const createdPeople = await Person.create(arrayOfPeople);
    console.log("People created:", createdPeople);


    const peopleWithNameAlice = await Person.find({ name: "Alice" });
    console.log("People with name Alice:", peopleWithNameAlice);

    const personWhoLikesBurger = await Person.findOne({
      favoriteFoods: "Burger",
    });
    console.log("Person who likes Burger:", personWhoLikesBurger);

    const personId = await Person.findOne({}, {}, { sort: { _id: -1 } }).then(
      (data) => data._id
    );
    const personById = await Person.findById(personId);
    console.log("Person by ID:", personById);

    const person = await Person.findById(personId);
    if (person) {
      person.favoriteFoods.push("Hamburger");
      const updatedPerson = await person.save();
      console.log("Updated person:", updatedPerson);
    } else {
      console.log("Person not found");
    }

    const personName = "Alice";
    const personToUpdate = await Person.findOne({ name: personName });
    if (personToUpdate) {
      personToUpdate.age = 20;
      const updatedPersonByName = await personToUpdate.save();
      console.log("Updated person by name:", updatedPersonByName);
    } else {
      console.log("Person not found");
    }
    const removedPerson = await Person.deleteOne(personId);
    console.log("Removed person:", removedPerson);

  
    const deletionResult = await Person.deleteMany({ name: "Mary" });
    console.log("Deleted:", deletionResult);

 
    const filteredAndSorted = await Person.find({ favoriteFoods: "Hamburger" })
      .sort("name")
      .limit(2)
      .select("-age");
    console.log("Filtered and sorted:", filteredAndSorted);
  } catch (error) {
    console.error(error);
  }

 
};


run();
