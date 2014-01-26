var naturalGeo = require("./waldo");

naturalGeo.addDocument("   A huge suicide car bomb explosion on Wednesday targeted at Muna hotel in Mogadishu, killing at least 15 people while dozens wounded, witnesses said.  The car bomb went off near the hotel in Hamar-weyne district, which is the base of tens of Somali Parliamentarians and government officials. All casualties were confirmed to be civilians and MPs. \
    A suicide car bomb exploded near Hotel Muna in Mogadishu. At least 15 people died while more than 25 others, including two members of parliament, were injured in the blast. Al Shabaab claimed responsibility for the explosion, saying it used a car to carry out the explosion. A number of government officials arrived at the scene of the explosion and confirmed that a car laden with explosive devices had exploded.")
    .addDocument("A suicide car bomb exploded near Hotel Muna in Mogadishu. ")
    .extractLocations("", function() {
        
    });