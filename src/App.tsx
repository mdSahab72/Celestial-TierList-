import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Rankings from './pages/Rankings';
import Testers from './pages/Testers';
import Boosters from './pages/Boosters';
import Discord from './pages/Discord';
import Staff from './pages/Staff';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="rankings" element={<Rankings />} />
          <Route path="testers" element={<Testers />} />
          <Route path="boosters" element={<Boosters />} />
          <Route path="discord" element={<Discord />} />
          <Route path="staff" element={<Staff />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
