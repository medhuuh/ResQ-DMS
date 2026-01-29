import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import PublicLayout from './components/layout/PublicLayout';
import VolunteerLayout from './components/layout/VolunteerLayout';
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPassword from './pages/auth/ForgotPassword';
import VolunteerSignup from './pages/public/VolunteerSignup';
import LiveDisasterStatus from './pages/public/LiveDisasterStatus';
import SafeHomeSearch from './pages/public/SafeHomeSearch';
import MissingPersonSearch from './pages/public/MissingPersonSearch';
import PublicShelters from './pages/public/PublicShelters';
import Dashboard from './pages/admin/Dashboard';
import DisasterAlerts from './pages/admin/DisasterAlerts';
import RiskZoneMap from './pages/admin/RiskZoneMap';
import CampList from './pages/camp/CampList';
import CampForm from './pages/camp/CampForm';   // Assuming these will be created
import CampOccupancy from './pages/camp/CampOccupancy';
import SafeHomeList from './pages/safehome/SafeHomeList';
import SafeHomeForm from './pages/safehome/SafeHomeForm';
import RefugeeList from './pages/refugee/RefugeeList';
import RefugeeRegister from './pages/refugee/RefugeeRegister';
import DonationPledge from './pages/resource/DonationPledge';
import MissingList from './pages/missing/MissingList';
import MissingRegister from './pages/missing/MissingRegister';
import VolunteerForm from './pages/volunteer/VolunteerForm';
import VolunteerList from './pages/volunteer/VolunteerList';
import UserProfile from './pages/profile/UserProfile';
import EditProfileForm from './pages/profile/EditProfileForm';

// Placeholders removed as actual components are imported

import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              {/* Public Routes (Wrapped in PublicLayout) */}
              {/* Public Routes (Minimal Access) */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<LiveDisasterStatus />} />
                <Route path="alerts" element={<DisasterAlerts isPublic={true} />} />
                <Route path="map" element={<RiskZoneMap isPublic={true} />} />
                <Route path="shelters" element={<PublicShelters />} />
                <Route path="missing-public" element={<MissingPersonSearch viewOnly={true} />} />
                <Route path="volunteer-signup" element={<VolunteerSignup />} />
                <Route path="donate" element={<DonationPledge />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* Volunteer Routes (Field Operations) */}
              <Route path="/volunteer" element={<VolunteerLayout />}>
                <Route index element={<VolunteerList />} />
                <Route path="alerts" element={<DisasterAlerts isPublic={true} />} />
                <Route path="map" element={<RiskZoneMap isPublic={true} />} />
                <Route path="camps" element={<CampList isPublic={true} canEdit={true} />} />
                <Route path="camps/new" element={<CampForm />} />
                <Route path="safe-homes" element={<SafeHomeSearch canEdit={true} />} />
                <Route path="safe-homes/new" element={<SafeHomeForm />} />
                <Route path="missing" element={<MissingPersonSearch />} />
                <Route path="missing/new" element={<MissingRegister />} />
              </Route>

              {/* Protected Admin/User Routes (wrapped in MainLayout) */}
              <Route path="/admin" element={<MainLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="alerts" element={<DisasterAlerts />} />
                <Route path="map" element={<RiskZoneMap />} />
                <Route path="camps" element={<CampList />} />
                <Route path="camps/new" element={<CampForm />} />
                <Route path="camps/occupancy" element={<CampOccupancy />} />
                <Route path="safe-homes" element={<SafeHomeList />} />
                <Route path="safe-homes/new" element={<SafeHomeForm />} />
                <Route path="refugees" element={<RefugeeList />} />
                <Route path="refugees/register" element={<RefugeeRegister />} />
                <Route path="missing-persons" element={<MissingList />} />
                <Route path="missing-persons/new" element={<MissingRegister />} />
                <Route path="volunteers/new" element={<VolunteerForm />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="profile/edit" element={<EditProfileForm />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
