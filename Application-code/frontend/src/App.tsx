import { BrowserRouter, Route, Routes } from "react-router-dom";
import Welcome from "./screens/welcome";
import Game from "./screens/game";
import Layout from "./screens/layout";
import Signup from "./screens/signup";
import Login from "./screens/login";
import useSocket from "./hooks/useSocket";


const App = () => {
  const socket = useSocket();
  return (
    <div className=" bg-[#302e2b]">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Welcome />} />
            <Route
              path="/game/:id"
              element={<Game socket={socket!} />}
            />
          </Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
