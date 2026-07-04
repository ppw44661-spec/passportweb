
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Login from "./pages/Login";
// import AdminLayout from "./pages/AdminLayout";
// import Dashboard from "./pages/Dashboard";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />

//         <Route element={<AdminLayout />}>
//           <Route path="/dashboard" element={<Dashboard />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AdminLayout from "./pages/AdminLayout";
import Dashboard from "./pages/Dashboard";
import PassportList from "./pages/PassportList";
import AddPassport from "./pages/AddPassport";
import PassportDetails from "./pages/PassportDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/passports" element={<PassportList />} />
          <Route path="/add-passport" element={<AddPassport />} />
          <Route path="/passports/edit/:id" element={<AddPassport />} />
          <Route path="/passports/:id" element={<PassportDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;