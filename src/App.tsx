import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// 页面组件（旧项目组件保持不动）
import { LandingPage } from '@/pages/LandingPage';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Dashboard } from '@/pages/Dashboard';
import { Editor } from '@/pages/Editor/[id]';
import { Preview } from '@/pages/Preview';
import { Settings } from '@/pages/Settings';
import { Annotations } from '@/pages/Annotations';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 公开路由 */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />

        {/* 受保护的路由 */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Navigate to="annotations" replace />} />
            <Route path="annotations" element={<Annotations />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/preview/:id" element={<Preview />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* 404 重定向 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
