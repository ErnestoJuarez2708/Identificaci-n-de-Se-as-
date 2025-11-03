import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Chat from "./pages/Chat";
//import Videos from "./pages/Videos";

const App: React.FC = () => {
  return (
    <Router>
      <div className="bg-gray-50 min-h-screen">
        <nav className="bg-blue-600 text-white p-4 flex justify-center space-x-6">
          <Link to="/chat" className="hover:underline">Chat</Link>
          <Link to="/videos" className="hover:underline">Videos</Link>
        </nav>

        <Routes>
          <Route path="/chat" element={<Chat />} />
          {/* <Route path="/videos" element={<Videos />} /> */}
          <Route path="*" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
