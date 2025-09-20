import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from './stories/useAuth';
import Header from './components/Header';
import HeaderAuth from './components/HeaderAuth';
import Profile from './Profile';
import Authentification from './Authentification';
import Registration from './Registration';
import Home from './Home';
import Learning from './Learning';
import Opportunities from './Opportunities';
import CareerPath from './CareerPath';

function AuthedLayout() {
    return (
        <>
            <HeaderAuth />
            <Outlet />
        </>
    );
}

function PublicLayout() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
}

export default function App(){
  const { isAuthenticated, setRoleFromDemo } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const demo = q.get('demo');
    if (demo === '1' || demo === '2') {
        setRoleFromDemo(demo);
        navigate(location.pathname, { replace: true });
    }
  }, [location.search, location.pathname, setRoleFromDemo, navigate]);

  const authed = isAuthenticated();

  return (
    <>
      <Routes>
        {authed ? (
          <Route element={<AuthedLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/career-path" element={<CareerPath />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        ) : (
          <Route element={<PublicLayout />}>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
        <Route path="/auth" element={<Authentification />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
    </>
  );
}
