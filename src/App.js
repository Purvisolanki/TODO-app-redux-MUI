import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./components/UserReducer";
import Home from "./components/Home";

const store = configureStore({
  reducer: {
    users: UserReducer,
  },
});
function App() {
  return (
    <>
      <Provider store={store}>
       <Home/>
      </Provider>
    </>
  );
}

export default App;
