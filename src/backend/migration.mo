import Map "mo:core/Map";

module {
  type Product = {
    id : Nat;
    brand : Text;
    name : Text;
    shortDescription : Text;
    imgPath : Text;
    tags : ?[Text];
  };

  type OldActor = {
    products : Map.Map<Nat, Product>;
  };

  type NewActor = {
    products : Map.Map<Nat, Product>;
  };

  public func run(old : OldActor) : NewActor {
    let newProducts = old.products.clone();

    newProducts.add(
      2,
      {
        id = 2;
        brand = "3M";
        name = "3M 1080 Film";
        shortDescription = "High quality vinyl wrap for car customization.";
        imgPath = "/assets/1080.jpg";
        tags = ?["vinyl", "car"];
      },
    );

    newProducts.add(
      3,
      {
        id = 3;
        brand = "3M";
        name = "3M Velcro Tape";
        shortDescription = "Adhesive backed hook and loop tape with strong bonding.";
        imgPath = "/assets/velcro-tape.jpg";
        tags = ?["tape", "velcro"];
      },
    );

    newProducts.add(
      4,
      {
        id = 4;
        brand = "3M";
        name = "3M Wire Harness Tape";
        shortDescription = "Automotive grade electrical tape for clean cable management.";
        imgPath = "/assets/wire-harness-tape.jpg";
        tags = ?["tape", "confused", "thunderstruck"];
      },
    );

    newProducts.add(
      5,
      {
        id = 5;
        brand = "Turtle Wax";
        name = "Turtle Wax Rubbing Compound";
        shortDescription = "Helps restore clear coat surfaces and shines paint.";
        imgPath = "/assets/rubbing-compound.jpg";
        tags = ?["compound", "polishing"];
      },
    );

    newProducts.add(
      6,
      {
        id = 6;
        brand = "Turtle Wax";
        name = "Turtle Wax Ceramic Car Wash";
        shortDescription = "Infuses wax and SHINE drying agents on contact.";
        imgPath = "/assets/turtlewax-ceramic.jpg";
        tags = ?["wash", "wax"];
      },
    );

    newProducts.add(
      7,
      {
        id = 7;
        brand = "Turtle Wax";
        name = "Turtle Wax All Wheel Cleaner";
        shortDescription = "Safe for all wheel types on your vehicle.";
        imgPath = "";
        tags = ?["cleaning"];
      },
    );

    newProducts.add(
      8,
      {
        id = 8;
        brand = "Turtle Wax";
        name = "Turtle Wax Ice Spray Wax";
        shortDescription = "Quick and easy spray application liquid wax.";
        imgPath = "/assets/spray-wax.jpg";
        tags = ?["wax", "ice"];
      },
    );

    {
      products = newProducts;
    };
  };
};
