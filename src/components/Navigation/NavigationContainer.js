import React from "react";
import NavigationParent from "./NavigationParent";

// We had a child for Navigation but we got rid of it because it was kind of redundant and we didn't need it
// We honestly don't need the parent, but it makes it more modular, I guess.
export default function NavigationContainer() {
  return <NavigationParent  />;
}
